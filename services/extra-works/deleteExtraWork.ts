import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { extraWorkRepository } from '@/data/extra-works';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteExtraWork = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await extraWorkRepository.getProjectIdById(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Допработа не найдена' };

  try {
    await extraWorkRepository.delete(id);
    revalidateExtraWorkPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении допработы:', error);
    return { ok: false, error: 'Не удалось удалить допработу' };
  }
};
