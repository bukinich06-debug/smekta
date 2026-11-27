import type { IFile } from '@/domain/files';
import { assertActFileReadAccess } from './assertActFileAccess';
import { assertReceiptFileReadAccess } from './assertReceiptFileAccess';
import { assertTzFileReadAccess } from './assertTzFileAccess';
import { assertPhotoFileReadAccess } from './assertPhotoFileAccess';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

export const assertFileReadAccess = async (userId: number, role: 'ADMIN' | 'CLIENT', file: IFile): Promise<IAccessResult> => {
  if (file.tab === 'RECEIPTS') return await assertReceiptFileReadAccess(userId, role, file);
  if (file.tab === 'ACTS') return await assertActFileReadAccess(userId, role, file);
  if (file.tab === 'TZ') return await assertTzFileReadAccess(userId, role, file);
  if (file.tab === 'PHOTOS') return await assertPhotoFileReadAccess(userId, role, file);

  return { ok: false, error: 'Файл недоступен' };
};
