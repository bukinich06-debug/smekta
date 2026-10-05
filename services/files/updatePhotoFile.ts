'use server';

import { fileRepository } from '@/data/files';
import type { PhotoAlbum } from '@/domain/files';
import { PHOTO_ALBUMS } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { assertPhotoAdminWriteAccess } from './helpers/assertPhotoFileAccess';
import { revalidatePhotoPaths } from './helpers/revalidatePhotoPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

interface IUpdatePhotoFileParams {
  fileId: number;
  caption?: string | null;
  album?: PhotoAlbum;
}

const parseAlbum = (album: PhotoAlbum | undefined): PhotoAlbum | undefined => {
  if (album === undefined) return undefined;
  if (!PHOTO_ALBUMS.some((item) => item.id === album)) return undefined;

  return album;
};

export const updatePhotoFile = async ({
  fileId,
  caption,
  album,
}: IUpdatePhotoFileParams): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const file = await fileRepository.getById(fileId);
  if (!file || file.tab !== 'PHOTOS') return { ok: false, error: 'Фото не найдено' };

  const access = await assertPhotoAdminWriteAccess(session, file.projectId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  const nextAlbum = parseAlbum(album);
  if (album !== undefined && !nextAlbum) return { ok: false, error: 'Некорректный альбом' };

  const nextCaption =
    caption === undefined
      ? undefined
      : caption === null || caption.trim().length === 0
        ? null
        : caption.trim();

  if (nextCaption === undefined && nextAlbum === undefined)
    return { ok: false, error: 'Нет изменений' };

  try {
    await fileRepository.updatePhotoFile(fileId, {
      caption: nextCaption,
      album: nextAlbum,
    });
    revalidatePhotoPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка обновления фото:', error);
    return { ok: false, error: 'Не удалось сохранить изменения' };
  }
};
