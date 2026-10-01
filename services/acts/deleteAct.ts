'use server';

import { actRepository } from '@/data/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateActPaths } from './helpers/revalidateActPaths';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteAct = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const existing = await actRepository.getById(id);
  if (!existing) return { ok: false, error: 'Акт не найден' };

  try {
    await actRepository.delete(id);
    revalidateActPaths();
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении акта:', error);
    return { ok: false, error: 'Не удалось удалить акт' };
  }
};
