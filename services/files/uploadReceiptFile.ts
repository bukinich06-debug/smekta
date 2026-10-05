'use server';

import { put } from '@vercel/blob';
import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { receiptRepository } from '@/data/receipts';
import { validateReceiptFileMeta } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateReceiptPaths } from '@/services/receipts/helpers/revalidateReceiptPaths';
import { assertReceiptAdminWriteAccess } from './helpers/assertReceiptFileAccess';
import { buildReceiptBlobPathname } from './helpers/buildReceiptBlobPathname';

interface IResult {
  ok: boolean;
  error?: string;
}

const isPhotoMime = (mimeType: string) => mimeType === 'image/jpeg' || mimeType === 'image/png';

export const uploadReceiptFile = async (formData: FormData): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const receiptIdRaw = formData.get('receiptId');
  const paymentIdRaw = formData.get('paymentId');
  const file = formData.get('file');

  if (!(file instanceof File)) return { ok: false, error: 'Файл не выбран' };

  const receiptId = typeof receiptIdRaw === 'string' ? parseInt(receiptIdRaw, 10) : NaN;
  if (isNaN(receiptId)) return { ok: false, error: 'Некорректный чек' };

  let paymentId: number | null = null;
  if (paymentIdRaw !== null && paymentIdRaw !== undefined && paymentIdRaw !== '') {
    const parsed = typeof paymentIdRaw === 'string' ? parseInt(paymentIdRaw, 10) : NaN;
    if (isNaN(parsed)) return { ok: false, error: 'Некорректная оплата' };
    paymentId = parsed;
  }

  const access = await assertReceiptAdminWriteAccess(session, receiptId);
  if (!access.ok || access.projectId === undefined) return { ok: false, error: access.error || 'Нет доступа' };

  if (paymentId !== null) {
    const paymentProjectId = await receiptRepository.getProjectIdByPaymentId(paymentId);
    if (paymentProjectId !== access.projectId) return { ok: false, error: 'Оплата не относится к этому чеку' };

    const receipt = await receiptRepository.getById(receiptId);
    if (!receipt?.payments.some((p) => p.id === paymentId))
      return { ok: false, error: 'Оплата не относится к этому чеку' };
  }

  const validationError = validateReceiptFileMeta({ mimeType: file.type, size: file.size });
  if (validationError) return { ok: false, error: validationError };

  const pathname = buildReceiptBlobPathname(access.projectId, receiptId, file.name);

  let uploadedPathname: string | null = null;

  try {
    const blob = await put(pathname, file, {
      access: 'private',
      contentType: file.type,
      addRandomSuffix: false,
    });

    uploadedPathname = blob.pathname;

    await fileRepository.create({
      projectId: access.projectId,
      receiptId,
      paymentId,
      storageKey: blob.pathname,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedById: session.user.id,
      isPhoto: isPhotoMime(file.type),
    });

    revalidateReceiptPaths();
    return { ok: true };
  } catch (error) {
    if (uploadedPathname) {
      try {
        await deleteBlobObjects([uploadedPathname]);
      } catch (rollbackError) {
        console.error('Не удалось удалить blob после ошибки записи в БД:', rollbackError);
      }
    }

    console.error('Ошибка загрузки файла чека:', error);
    return { ok: false, error: 'Не удалось загрузить файл' };
  }
};
