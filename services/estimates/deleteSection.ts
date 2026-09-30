'use server';

import { estimateRepository } from '@/data/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteSection = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    await estimateRepository.deleteSection(id);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении раздела:', error);
    return { ok: false, error: 'Не удалось удалить раздел' };
  }
};
