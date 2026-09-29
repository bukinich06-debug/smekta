'use server';

import { getSession } from '@/services/auth/getSession';
import { clientRepository } from '@/data/clients';
import { randomBytes } from 'crypto';

export const generateInviteToken = async (clientId: number): Promise<{ token: string } | { error: string }> => {
  const session = await getSession();

  if (!session) return { error: 'Требуется авторизация' };
  if (session.user.role !== 'ADMIN') return { error: 'Недостаточно прав' };

  const token = randomBytes(32).toString('base64url');

  try {
    await clientRepository.generateInviteToken(clientId, token);
    return { token };
  } catch {
    return { error: 'Не удалось сгенерировать ссылку' };
  }
};
