'use server';

import { clientRepository } from '@/data/clients';
import { ownsClient, ownsProject } from '@/services/clients/helpers/assertProjectManager';
import type { IUpdateClientCardInput } from '@/domain/clients';
import { validateUpdateClientCard } from '@/domain/clients';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

interface IUpdateClientCardResult {
  ok: boolean;
  error?: string;
}

export const updateClientCard = async (
  clientId: number,
  projectId: number,
  input: IUpdateClientCardInput
): Promise<IUpdateClientCardResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const ownClient = await ownsClient(session.user.id, clientId);
  const ownProject = await ownsProject(session.user.id, projectId);
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
