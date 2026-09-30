'use server';

import { addPayment } from './addPayment';
import { receiptRepository } from '@/data/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

interface IResult {
  ok: boolean;
  error?: string;
}

export const payReceiptFull = async (receiptId: number, date: Date): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const receipt = await receiptRepository.getById(receiptId);
  if (!receipt) return { ok: false, error: 'Чек не найден' };

  if (receipt.remainder <= 0) return { ok: false, error: 'Чек уже оплачен полностью' };

  const result = await addPayment({
    receiptId,
    date,
    amount: receipt.remainder.toFixed(2),
  });

  if (!result.ok) return { ok: false, error: result.error };

  return { ok: true };
};
