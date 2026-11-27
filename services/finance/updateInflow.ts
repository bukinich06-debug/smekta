import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import { validateUpdateInflow } from '@/domain/finance';
import type { IUpdateInflowInput, IProjectInflow } from '@/domain/finance';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  data?: IProjectInflow;
  error?: string;
}

export const updateInflow = async (id: number, input: IUpdateInflowInput, userId: number): Promise<IResult> => {
  const projectId = await financeRepository.getProjectIdByInflowId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Поступление не найдено' };

  const validationError = validateUpdateInflow(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.updateInflow(id, input, userId);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при изменении поступления:', error);
    return { ok: false, error: 'Не удалось сохранить поступление' };
  }
};
