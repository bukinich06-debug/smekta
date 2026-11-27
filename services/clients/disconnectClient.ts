import 'server-only';

import { clientRepository } from '@/data/clients';
import { ownsClient } from '@/services/clients/helpers/assertProjectManager';

export const disconnectClient = async (
  clientId: number,
  userId: number
): Promise<{ ok: true } | { error: string }> => {
  const own = await ownsClient(userId, clientId);
  if (!own) return { error: 'Заказчик не найден' };

  const client = await clientRepository.getById(clientId);

  if (!client) return { error: 'Заказчик не найден' };
  if (!client.userId) return { error: 'Заказчик не подключён к аккаунту' };

  const disconnected = await clientRepository.disconnectLinkedUser(clientId);

  if (!disconnected) return { error: 'Не удалось отключить заказчика' };

  return { ok: true };
};
