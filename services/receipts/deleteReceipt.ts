'use server';

import { receiptRepository } from '@/data/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteReceipt = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const existing = await receiptRepository.getById(id);
  if (!existing) return { ok: false, error: 'Чек не найден' };

  try {
    await receiptRepository.delete(id, session.user.id);
    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении чека:', error);
    return { ok: false, error: 'Не удалось удалить чек' };
  }
};
