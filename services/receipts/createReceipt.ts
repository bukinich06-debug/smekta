import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { receiptRepository } from '@/data/receipts';
import { validateCreateReceipt } from '@/domain/receipts';
import type { ICreateReceiptInput, IReceipt } from '@/domain/receipts';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  data?: IReceipt;
  error?: string;
}

export const createReceipt = async (input: ICreateReceiptInput, userId: number): Promise<IResult> => {
  if (!(await ownsProject(userId, input.projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateCreateReceipt(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await receiptRepository.create(input, userId);
    revalidateReceiptPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при создании чека:', error);
    return { ok: false, error: 'Не удалось создать чек' };
  }
};
