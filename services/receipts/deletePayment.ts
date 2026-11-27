import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { receiptRepository } from '@/data/receipts';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deletePayment = async (paymentId: number, userId: number): Promise<IResult> => {
  const projectId = await receiptRepository.getProjectIdByPaymentId(paymentId);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Оплата не найдена' };

  try {
    await receiptRepository.deletePayment(paymentId, userId);
    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === 'DEPOSIT_PAYMENT_READONLY')
      return { ok: false, error: 'Зачёт из депозита нельзя удалить вручную — измените сумму чека' };

    console.error('Ошибка при удалении оплаты:', error);
    return { ok: false, error: 'Не удалось удалить оплату' };
  }
};
