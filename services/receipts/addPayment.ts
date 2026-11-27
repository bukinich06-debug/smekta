import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { receiptRepository } from '@/data/receipts';
import { validateAddPayment } from '@/domain/receipts';
import type { IAddPaymentInput, IReceiptPayment } from '@/domain/receipts';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  data?: IReceiptPayment;
  error?: string;
}

export const addPayment = async (input: IAddPaymentInput, userId: number): Promise<IResult> => {
  const projectId = await receiptRepository.getProjectIdByReceiptId(input.receiptId);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Чек не найден' };

  const receipt = await receiptRepository.getById(input.receiptId);
  if (!receipt) return { ok: false, error: 'Чек не найден' };

  const validationError = validateAddPayment({
    input,
    amountDue: receipt.amountDue,
    payments: receipt.payments,
  });
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await receiptRepository.addPayment(input, userId);
    revalidateReceiptPaths();
    return { ok: true, data };
  } catch (error) {
    if (error instanceof Error && error.message === 'PAYMENT_EXCEEDS_REMAINDER')
      return { ok: false, error: 'Сумма оплаты не может превышать остаток' };

    console.error('Ошибка при добавлении оплаты:', error);
    return { ok: false, error: 'Не удалось добавить оплату' };
  }
};
