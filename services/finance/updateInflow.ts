'use server';

import { financeRepository } from '@/data/finance';
import { validateUpdateInflow } from '@/domain/finance';
import type { IUpdateInflowInput, IProjectInflow } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';

interface IResult {
  ok: boolean;
  data?: IProjectInflow;
  error?: string;
}

export const updateInflow = async (id: number, input: IUpdateInflowInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateUpdateInflow(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.updateInflow(id, input, session.user.id);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при изменении поступления:', error);
    if (error instanceof Error && error.message === 'INFLOW_NOT_FOUND')
      return { ok: false, error: 'Поступление не найдено' };
    return { ok: false, error: 'Не удалось сохранить поступление' };
  }
};
