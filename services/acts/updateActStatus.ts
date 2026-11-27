import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import type { ActStatus } from '@prisma/client';
import { actRepository } from '@/data/acts';
import type { IAct } from '@/domain/acts';
import { revalidateActPaths } from './helpers/revalidateActPaths';

interface IResult {
  ok: boolean;
  data?: IAct;
  error?: string;
}

const allowed: ActStatus[] = ['DRAFT', 'SENT', 'SIGNED'];

export const updateActStatus = async (id: number, status: ActStatus, userId: number): Promise<IResult> => {
  const projectId = await actRepository.getProjectIdByActId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Акт не найден' };

  if (!allowed.includes(status)) return { ok: false, error: 'Некорректный статус' };

  try {
    const data = await actRepository.updateStatus(id, status, userId);
    revalidateActPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при смене статуса акта:', error);

    if (error instanceof Error && error.message === 'ACT_NOT_FOUND')
      return { ok: false, error: 'Акт не найден' };

    return { ok: false, error: 'Не удалось изменить статус' };
  }
};
