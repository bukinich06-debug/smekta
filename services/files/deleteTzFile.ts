'use server';

import { fileRepository } from '@/data/files';
import { deleteBlobObjects } from '@/data/files/helpers/deleteBlobObjects';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { assertTzAdminWriteAccess } from './helpers/assertTzFileAccess';
import { revalidateTzPaths } from './helpers/revalidateTzPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteTzFile = async (fileId: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const file = await fileRepository.getById(fileId);
  if (!file || file.tab !== 'TZ') return { ok: false, error: 'Файл не найден' };

  const access = await assertTzAdminWriteAccess(session, file.projectId);
  if (!access.ok) return { ok: false, error: access.error || 'Нет доступа' };

  try {
    await deleteBlobObjects([file.storageKey]);
    await fileRepository.delete(fileId);
    revalidateTzPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка удаления файла ТЗ:', error);
    return { ok: false, error: 'Не удалось удалить файл' };
  }
};
