'use server';

import { put } from '@vercel/blob';
import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { validateActFileMeta } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateActPaths } from '@/services/acts/helpers/revalidateActPaths';
import { assertActAdminWriteAccess } from './helpers/assertActFileAccess';
import { buildActBlobPathname } from './helpers/buildActBlobPathname';

interface IResult {
  ok: boolean;
  error?: string;
}

const isPhotoMime = (mimeType: string) => mimeType === 'image/jpeg' || mimeType === 'image/png';

export const uploadActFile = async (formData: FormData): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const actIdRaw = formData.get('actId');
  const file = formData.get('file');

  if (!(file instanceof File)) return { ok: false, error: 'Файл не выбран' };

  const actId = typeof actIdRaw === 'string' ? parseInt(actIdRaw, 10) : NaN;
  if (isNaN(actId)) return { ok: false, error: 'Некорректный акт' };

  const access = await assertActAdminWriteAccess(session, actId);
  if (!access.ok || access.projectId === undefined) return { ok: false, error: access.error || 'Нет доступа' };

  const validationError = validateActFileMeta({ mimeType: file.type, size: file.size });
  if (validationError) return { ok: false, error: validationError };

  const pathname = buildActBlobPathname(access.projectId, actId, file.name);

  let uploadedPathname: string | null = null;

  try {
    const blob = await put(pathname, file, {
      access: 'private',
      contentType: file.type,
      addRandomSuffix: false,
    });

    uploadedPathname = blob.pathname;

    await fileRepository.createActFile({
      projectId: access.projectId,
      actId,
      storageKey: blob.pathname,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedById: session.user.id,
      isPhoto: isPhotoMime(file.type),
    });

    revalidateActPaths();
    return { ok: true };
  } catch (error) {
    if (uploadedPathname) {
      try {
        await deleteBlobObjects([uploadedPathname]);
      } catch (rollbackError) {
        console.error('Не удалось удалить blob после ошибки записи в БД:', rollbackError);
      }
    }

    console.error('Ошибка загрузки файла акта:', error);
    return { ok: false, error: 'Не удалось загрузить файл' };
  }
};
