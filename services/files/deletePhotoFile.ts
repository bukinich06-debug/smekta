import 'server-only';

import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { assertPhotoAdminWriteAccess } from './helpers/assertPhotoFileAccess';
import { revalidatePhotoPaths } from './helpers/revalidatePhotoPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deletePhotoFile = async (fileId: number, userId: number): Promise<IResult> => {
  const file = await fileRepository.getById(fileId);
  if (!file || file.tab !== 'PHOTOS') return { ok: false, error: 'Фото не найдено' };

  const access = await assertPhotoAdminWriteAccess(userId, file.projectId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  try {
    await deleteBlobObjects([file.storageKey]);
    await fileRepository.delete(fileId);
    revalidatePhotoPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка удаления фото:', error);
    return { ok: false, error: 'Не удалось удалить фото' };
  }
};
