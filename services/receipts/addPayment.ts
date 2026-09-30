'use server';

import { receiptRepository } from '@/data/receipts';
import { validateAddPayment } from '@/domain/receipts';
import type { IAddPaymentInput, IReceiptPayment } from '@/domain/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  data?: IReceiptPayment;
  error?: string;
}

export const addPayment = async (input: IAddPaymentInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const receipt = await receiptRepository.getById(input.receiptId);
  if (!receipt) return { ok: false, error: 'Чек не найден' };

  const validationError = validateAddPayment({
    input,
    amountDue: receipt.amountDue,
    payments: receipt.payments,
  });
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await receiptRepository.addPayment(input, session.user.id);
    revalidateReceiptPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при добавлении оплаты:', error);
    return { ok: false, error: 'Не удалось добавить оплату' };
  }
};
