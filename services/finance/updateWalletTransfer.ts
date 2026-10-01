'use server';

import { financeRepository } from '@/data/finance';
import { validateUpdateTransfer } from '@/domain/finance';
import type { IUpdateTransferInput, IWalletTransfer } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';

interface IResult {
  ok: boolean;
  data?: IWalletTransfer;
  error?: string;
}

export const updateWalletTransfer = async (
  id: number,
  input: IUpdateTransferInput
): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const current = await financeRepository.getTransferById(id);
  if (!current) return { ok: false, error: 'Перевод не найден' };

  const validationError = validateUpdateTransfer(input, {
    fromWallet: current.fromWallet,
    toWallet: current.toWallet,
  });
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.updateTransfer(id, input, session.user.id);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при изменении перевода:', error);
    if (error instanceof Error && error.message === 'TRANSFER_NOT_FOUND')
      return { ok: false, error: 'Перевод не найден' };
    return { ok: false, error: 'Не удалось сохранить перевод' };
  }
};
