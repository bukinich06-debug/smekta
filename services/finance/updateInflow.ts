'use server';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';

import { financeRepository } from '@/data/finance';
import { validateUpdateInflow } from '@/domain/finance';
import type { IUpdateInflowInput, IProjectInflow } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  data?: IProjectInflow;
  error?: string;
}

export const updateInflow = async (id: number, input: IUpdateInflowInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const projectId = await financeRepository.getProjectIdByInflowId(id);
  if (!projectId || !(await ownsProject(session.user.id, projectId)))
    return { ok: false, error: 'Поступление не найдено' };

  const validationError = validateUpdateInflow(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.updateInflow(id, input, session.user.id);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при изменении поступления:', error);
    return { ok: false, error: 'Не удалось сохранить поступление' };
  }
};
