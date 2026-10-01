'use server';

import { financeRepository } from '@/data/finance';
import { validateCreateTransfer } from '@/domain/finance';
import type { ICreateTransferInput, IWalletTransfer } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';

interface IResult {
  ok: boolean;
  data?: IWalletTransfer;
  error?: string;
}

export const createWalletTransfer = async (input: ICreateTransferInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateCreateTransfer(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.createTransfer(input, session.user.id);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при создании перевода:', error);
    return { ok: false, error: 'Не удалось сохранить перевод' };
  }
};
