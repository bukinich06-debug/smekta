'use server';

import { financeRepository } from '@/data/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteWalletTransfer = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    await financeRepository.deleteTransfer(id, session.user.id);
    revalidateFinancePaths();
    return { ok: true };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при удалении перевода:', error);
    return { ok: false, error: 'Не удалось удалить перевод' };
  }
};
