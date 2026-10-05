import type { IFile } from '@/domain/files';
import type { IAuthSession } from '@/domain/auth';
import { assertActFileReadAccess } from './assertActFileAccess';
import { assertReceiptFileReadAccess } from './assertReceiptFileAccess';
import { assertTzFileReadAccess } from './assertTzFileAccess';
import { assertPhotoFileReadAccess } from './assertPhotoFileAccess';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

export const assertFileReadAccess = async (session: IAuthSession, file: IFile): Promise<IAccessResult> => {
  if (file.tab === 'RECEIPTS') return await assertReceiptFileReadAccess(session, file);
  if (file.tab === 'ACTS') return await assertActFileReadAccess(session, file);
  if (file.tab === 'TZ') return await assertTzFileReadAccess(session, file);
  if (file.tab === 'PHOTOS') return await assertPhotoFileReadAccess(session, file);

  return { ok: false, error: 'Файл недоступен' };
};
