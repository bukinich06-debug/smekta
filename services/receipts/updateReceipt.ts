'use server';

import { receiptRepository } from '@/data/receipts';
import { validateUpdateReceipt } from '@/domain/receipts';
import type { IUpdateReceiptInput, IReceipt } from '@/domain/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  data?: IReceipt;
  error?: string;
}

export const updateReceipt = async (id: number, input: IUpdateReceiptInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateUpdateReceipt(input);
  if (validationError) return { ok: false, error: validationError };

  const existing = await receiptRepository.getById(id);
  if (!existing) return { ok: false, error: 'Чек не найден' };

  if (input.amountDue !== undefined) {
    const newDue = parseFloat(input.amountDue);
    if (newDue < existing.paid)
      return { ok: false, error: 'Сумма к оплате не может быть меньше уже оплаченной' };
  }

  try {
    const data = await receiptRepository.update(id, input);
    revalidateReceiptPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при обновлении чека:', error);
    return { ok: false, error: 'Не удалось обновить чек' };
  }
};
