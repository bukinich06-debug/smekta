import 'server-only';

import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { revalidateReceiptPaths } from '@/services/receipts/helpers/revalidateReceiptPaths';
import { assertReceiptAdminWriteAccess } from './helpers/assertReceiptFileAccess';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteReceiptFile = async (fileId: number, userId: number): Promise<IResult> => {
  const file = await fileRepository.getById(fileId);
  if (!file || file.tab !== 'RECEIPTS' || file.receiptId === null)
    return { ok: false, error: 'Файл не найден' };

  const access = await assertReceiptAdminWriteAccess(userId, file.receiptId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  try {
    await deleteBlobObjects([file.storageKey]);
    await fileRepository.delete(fileId);
    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка удаления файла чека:', error);
    return { ok: false, error: 'Не удалось удалить файл' };
  }
};
