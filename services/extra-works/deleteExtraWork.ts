'use server';

import { extraWorkRepository } from '@/data/extra-works';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteExtraWork = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    await extraWorkRepository.delete(id);
    revalidateExtraWorkPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении допработы:', error);
    return { ok: false, error: 'Не удалось удалить допработу' };
  }
};
