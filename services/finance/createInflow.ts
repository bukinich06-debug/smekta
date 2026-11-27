import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import { validateCreateInflow } from '@/domain/finance';
import type { ICreateInflowInput, IProjectInflow } from '@/domain/finance';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  data?: IProjectInflow;
  error?: string;
}

export const createInflow = async (input: ICreateInflowInput, userId: number): Promise<IResult> => {
  if (!(await ownsProject(userId, input.projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateCreateInflow(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.createInflow(input, userId);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при создании поступления:', error);
    return { ok: false, error: 'Не удалось сохранить поступление' };
  }
};
