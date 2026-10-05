'use server';

import { del } from '@vercel/blob';
import { fileRepository } from '@/data/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from '@/services/receipts/helpers/revalidateReceiptPaths';
import { assertReceiptAdminWriteAccess } from './helpers/assertReceiptFileAccess';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteReceiptFile = async (fileId: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const file = await fileRepository.getById(fileId);
  if (!file || file.tab !== 'RECEIPTS' || file.receiptId === null)
    return { ok: false, error: 'Файл не найден' };

  const access = await assertReceiptAdminWriteAccess(session, file.receiptId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  try {
    await del(file.storageKey);
    await fileRepository.delete(fileId);
    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка удаления файла чека:', error);
    return { ok: false, error: 'Не удалось удалить файл' };
  }
};
