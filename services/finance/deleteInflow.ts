'use server';

import { financeRepository } from '@/data/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteInflow = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    await financeRepository.deleteInflow(id, session.user.id);
    revalidateFinancePaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении поступления:', error);
    if (error instanceof Error && error.message === 'INFLOW_NOT_FOUND')
      return { ok: false, error: 'Поступление не найдено' };
    return { ok: false, error: 'Не удалось удалить поступление' };
  }
};
