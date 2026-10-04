'use server';

import { financeRepository } from '@/data/finance';
import { validateCreateInflow } from '@/domain/finance';
import type { ICreateInflowInput, IProjectInflow } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  data?: IProjectInflow;
  error?: string;
}

export const createInflow = async (input: ICreateInflowInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateCreateInflow(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.createInflow(input, session.user.id);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при создании поступления:', error);
    return { ok: false, error: 'Не удалось сохранить поступление' };
  }
};
