'use server';

import { put } from '@vercel/blob';
import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import type { PhotoAlbum } from '@/domain/files';
import { PHOTO_ALBUMS, validatePhotoFileMeta } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { assertPhotoAdminWriteAccess } from './helpers/assertPhotoFileAccess';
import { buildPhotoBlobPathname } from './helpers/buildPhotoBlobPathname';
import { revalidatePhotoPaths } from './helpers/revalidatePhotoPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

const parseAlbum = (value: FormDataEntryValue | null): PhotoAlbum | null => {
  if (typeof value !== 'string') return null;
  if (!PHOTO_ALBUMS.some((item) => item.id === value)) return null;

  return value as PhotoAlbum;
};

export const uploadPhotoFile = async (formData: FormData): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const projectIdRaw = formData.get('projectId');
  const album = parseAlbum(formData.get('album'));
  const captionRaw = formData.get('caption');
  const file = formData.get('file');

  if (!(file instanceof File)) return { ok: false, error: 'Файл не выбран' };
  if (!album) return { ok: false, error: 'Выберите альбом' };

  const projectId = typeof projectIdRaw === 'string' ? parseInt(projectIdRaw, 10) : NaN;
  if (isNaN(projectId)) return { ok: false, error: 'Некорректный проект' };

  const access = await assertPhotoAdminWriteAccess(session, projectId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  const validationError = validatePhotoFileMeta({ mimeType: file.type, size: file.size });
  if (validationError) return { ok: false, error: validationError };

  const caption =
    typeof captionRaw === 'string' && captionRaw.trim().length > 0 ? captionRaw.trim() : null;

  const pathname = buildPhotoBlobPathname(projectId, file.name);

  let uploadedPathname: string | null = null;

  try {
    const blob = await put(pathname, file, {
      access: 'private',
      contentType: file.type,
      addRandomSuffix: false,
    });

    uploadedPathname = blob.pathname;

    await fileRepository.createPhotoFile({
      projectId,
      storageKey: blob.pathname,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedById: session.user.id,
      album,
      caption,
    });

    revalidatePhotoPaths();
    return { ok: true };
  } catch (error) {
    if (uploadedPathname) {
      try {
        await deleteBlobObjects([uploadedPathname]);
      } catch (rollbackError) {
        console.error('Не удалось удалить blob после ошибки записи в БД:', rollbackError);
      }
    }

    console.error('Ошибка загрузки фото:', error);
    return { ok: false, error: 'Не удалось загрузить фото' };
  }
};
