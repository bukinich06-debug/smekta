'use server';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';

import { receiptRepository } from '@/data/receipts';
import { validateCreateReceipt } from '@/domain/receipts';
import type { ICreateReceiptInput, IReceipt } from '@/domain/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  data?: IReceipt;
  error?: string;
}

export const createReceipt = async (input: ICreateReceiptInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  if (!(await ownsProject(session.user.id, input.projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateCreateReceipt(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await receiptRepository.create(input, session.user.id);
    revalidateReceiptPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при создании чека:', error);
    return { ok: false, error: 'Не удалось создать чек' };
  }
};
