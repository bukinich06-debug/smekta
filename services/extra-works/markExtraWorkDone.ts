import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { extraWorkRepository } from '@/data/extra-works';
import type { IExtraWork } from '@/domain/extra-works';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';
import { revalidateFinancePaths } from '@/services/finance/helpers/revalidateFinancePaths';

interface IResult {
  ok: boolean;
  data?: IExtraWork;
  error?: string;
}

export const markExtraWorkDone = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await extraWorkRepository.getProjectIdById(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Допработа не найдена' };

  try {
    const data = await extraWorkRepository.markDone(id);
    revalidateExtraWorkPaths();
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при отметке допработы выполненной:', error);
    const message = error instanceof Error ? error.message : 'Не удалось отметить допработу выполненной';
    return { ok: false, error: message };
  }
};
