'use server';

import { put } from '@vercel/blob';
import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { validateTzFileMeta } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { assertTzAdminWriteAccess } from './helpers/assertTzFileAccess';
import { buildTzBlobPathname } from './helpers/buildTzBlobPathname';
import { revalidateTzPaths } from './helpers/revalidateTzPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

const isPhotoMime = (mimeType: string) => mimeType === 'image/jpeg' || mimeType === 'image/png';

export const uploadTzFile = async (formData: FormData): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const projectIdRaw = formData.get('projectId');
  const file = formData.get('file');

  if (!(file instanceof File)) return { ok: false, error: 'Файл не выбран' };

  const projectId = typeof projectIdRaw === 'string' ? parseInt(projectIdRaw, 10) : NaN;
  if (isNaN(projectId)) return { ok: false, error: 'Некорректный проект' };

  const access = await assertTzAdminWriteAccess(session, projectId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  const validationError = validateTzFileMeta({ mimeType: file.type, size: file.size });
  if (validationError) return { ok: false, error: validationError };

  const pathname = buildTzBlobPathname(projectId, file.name);

  let uploadedPathname: string | null = null;

  try {
    const blob = await put(pathname, file, {
      access: 'private',
      contentType: file.type,
      addRandomSuffix: false,
    });

    uploadedPathname = blob.pathname;

    await fileRepository.createTzFile({
      projectId,
      storageKey: blob.pathname,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedById: session.user.id,
      isPhoto: isPhotoMime(file.type),
    });

    revalidateTzPaths();
    return { ok: true };
  } catch (error) {
    if (uploadedPathname) {
      try {
        await deleteBlobObjects([uploadedPathname]);
      } catch (rollbackError) {
        console.error('Не удалось удалить blob после ошибки записи в БД:', rollbackError);
      }
    }

    console.error('Ошибка загрузки файла ТЗ:', error);
    return { ok: false, error: 'Не удалось загрузить файл' };
  }
};
