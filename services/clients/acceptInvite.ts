import 'server-only';

import { clientRepository } from '@/data/clients';

export const acceptInvite = async (token: string, userId: number): Promise<{ success: boolean; error?: string }> => {
  const client = await clientRepository.getByInviteToken(token);

  if (!client) return { success: false, error: 'Ссылка недействительна или уже использована' };

  const userAlreadyLinked = await clientRepository.getById(client.id);

  if (userAlreadyLinked?.userId && userAlreadyLinked.userId !== userId) {
    return { success: false, error: 'Этот проект уже подключён к другому аккаунту' };
  }

  const accepted = await clientRepository.acceptInvite(token, userId);

  if (!accepted) return { success: false, error: 'Ссылка недействительна или уже использована' };

  return { success: true };
};
