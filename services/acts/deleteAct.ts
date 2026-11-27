import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { actRepository } from '@/data/acts';
import { purgeBlobFilesForAct } from '@/data/files/helpers/purgeBlobFiles';
import { revalidateActPaths } from './helpers/revalidateActPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteAct = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await actRepository.getProjectIdByActId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Акт не найден' };

  const existing = await actRepository.getById(id);
  if (!existing) return { ok: false, error: 'Акт не найден' };

  try {
    await purgeBlobFilesForAct(id);
    await actRepository.delete(id);
    revalidateActPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении акта:', error);
    return { ok: false, error: 'Не удалось удалить акт' };
  }
};
