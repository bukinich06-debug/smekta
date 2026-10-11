'use server';

import { getSession } from '@/services/auth/getSession';
import { clientRepository } from '@/data/clients';
import { ownsClient } from '@/services/clients/helpers/assertProjectManager';

export const disconnectClient = async (
  clientId: number
): Promise<{ ok: true } | { error: string }> => {
  const session = await getSession();

  if (!session) return { error: 'Требуется авторизация' };
  if (session.user.role !== 'ADMIN') return { error: 'Недостаточно прав' };

  const own = await ownsClient(session.user.id, clientId);
  if (!own) return { error: 'Заказчик не найден' };

  const client = await clientRepository.getById(clientId);

  if (!client) return { error: 'Заказчик не найден' };
  if (!client.userId) return { error: 'Заказчик не подключён к аккаунту' };

  const disconnected = await clientRepository.disconnectLinkedUser(clientId);

  if (!disconnected) return { error: 'Не удалось отключить заказчика' };

  return { ok: true };
};
