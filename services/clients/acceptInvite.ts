'use server';

import { getSession } from '@/services/auth/getSession';
import { clientRepository } from '@/data/clients';

export const acceptInvite = async (token: string): Promise<{ success: boolean; error?: string }> => {
  const session = await getSession();

  if (!session) return { success: false, error: 'Требуется авторизация' };
  if (session.user.role !== 'CLIENT') return { success: false, error: 'Эта ссылка предназначена для заказчика' };

  const client = await clientRepository.getByInviteToken(token);

  if (!client) return { success: false, error: 'Ссылка недействительна или уже использована' };

  const userAlreadyLinked = await clientRepository.getById(client.id);

  if (userAlreadyLinked?.userId && userAlreadyLinked.userId !== session.user.id) {
    return { success: false, error: 'Этот проект уже подключён к другому аккаунту' };
  }

  const accepted = await clientRepository.acceptInvite(token, session.user.id);

  if (!accepted) return { success: false, error: 'Ссылка недействительна или уже использована' };

  return { success: true };
};
