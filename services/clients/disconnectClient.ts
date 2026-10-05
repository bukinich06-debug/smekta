'use server';

import { getSession } from '@/services/auth/getSession';
import { clientRepository } from '@/data/clients';

export const disconnectClient = async (
  clientId: number
): Promise<{ ok: true } | { error: string }> => {
  const session = await getSession();

  if (!session) return { error: 'Требуется авторизация' };
  if (session.user.role !== 'ADMIN') return { error: 'Недостаточно прав' };

  const client = await clientRepository.getById(clientId);

  if (!client) return { error: 'Заказчик не найден' };
  if (!client.userId) return { error: 'Заказчик не подключён к аккаунту' };

  const disconnected = await clientRepository.disconnectLinkedUser(clientId);

  if (!disconnected) return { error: 'Не удалось отключить заказчика' };

  return { ok: true };
};
