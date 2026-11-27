import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { receiptRepository } from '@/data/receipts';
import { revalidateReceiptPaths } from './helpers/revalidateReceiptPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteReceipt = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await receiptRepository.getProjectIdByReceiptId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Чек не найден' };

  const existing = await receiptRepository.getById(id);
  if (!existing) return { ok: false, error: 'Чек не найден' };

  try {
    await receiptRepository.delete(id, userId);
    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении чека:', error);
    return { ok: false, error: 'Не удалось удалить чек' };
  }
};
