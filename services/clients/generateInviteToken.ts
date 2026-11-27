import 'server-only';

import { clientRepository } from '@/data/clients';
import { ownsClient } from '@/services/clients/helpers/assertProjectManager';
import { randomBytes } from 'crypto';

export const generateInviteToken = async (clientId: number, userId: number): Promise<{ token: string } | { error: string }> => {
  const own = await ownsClient(userId, clientId);
  if (!own) return { error: 'Заказчик не найден' };

  const client = await clientRepository.getById(clientId);

  if (!client) return { error: 'Заказчик не найден' };
  if (client.userId) return { error: 'Заказчик уже подключён к аккаунту' };

  const token = randomBytes(32).toString('base64url');

  try {
    await clientRepository.generateInviteToken(clientId, token);
    return { token };
  } catch {
    return { error: 'Не удалось сгенерировать ссылку' };
  }
};
