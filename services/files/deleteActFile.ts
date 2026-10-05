'use server';

import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateActPaths } from '@/services/acts/helpers/revalidateActPaths';
import { assertActAdminWriteAccess } from './helpers/assertActFileAccess';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteActFile = async (fileId: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const file = await fileRepository.getById(fileId);
  if (!file || file.tab !== 'ACTS' || file.actId === null) return { ok: false, error: 'Файл не найден' };

  const access = await assertActAdminWriteAccess(session, file.actId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  try {
    await deleteBlobObjects([file.storageKey]);
    await fileRepository.delete(fileId);
    revalidateActPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка удаления файла акта:', error);
    return { ok: false, error: 'Не удалось удалить файл' };
  }
};
