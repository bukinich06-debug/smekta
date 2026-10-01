'use server';

import { receiptRepository } from '@/data/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deletePayment = async (paymentId: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const projectId = await receiptRepository.getProjectIdByPaymentId(paymentId);
  if (!projectId) return { ok: false, error: 'Оплата не найдена' };

  try {
    await receiptRepository.deletePayment(paymentId);
    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === 'DEPOSIT_PAYMENT_READONLY')
      return { ok: false, error: 'Зачёт из депозита нельзя удалить вручную — измените сумму чека' };

    console.error('Ошибка при удалении оплаты:', error);
    return { ok: false, error: 'Не удалось удалить оплату' };
  }
};
