import 'server-only';

import { clientRepository } from '@/data/clients';
import { ownsClient, ownsProject } from '@/services/clients/helpers/assertProjectManager';
import type { IUpdateClientCardInput } from '@/domain/clients';
import { validateUpdateClientCard } from '@/domain/clients';

interface IUpdateClientCardResult {
  ok: boolean;
  error?: string;
}

export const updateClientCard = async (
  clientId: number,
  projectId: number,
  input: IUpdateClientCardInput,
  userId: number
): Promise<IUpdateClientCardResult> => {
  const ownClient = await ownsClient(userId, clientId);
  const ownProject = await ownsProject(userId, projectId);
  if (!ownClient || !ownProject) return { ok: false, error: 'Заказчик не найден' };

  const errors = validateUpdateClientCard(input);
  if (errors.length > 0) return { ok: false, error: errors.join('; ') };

  try {
    await clientRepository.updateCard(clientId, projectId, input);
    return { ok: true };
  } catch (err) {
    console.error('Ошибка при обновлении карточки:', err);
    return { ok: false, error: 'Не удалось обновить карточку. Попробуйте ещё раз.' };
  }
};
