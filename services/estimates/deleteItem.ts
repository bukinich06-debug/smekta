'use server';

import { estimateRepository } from '@/data/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { mapEstimateDeleteError } from '@/services/estimates/helpers/mapEstimateDeleteError';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteItem = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    await estimateRepository.deleteItem(id);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении позиции:', error);
    const message = await mapEstimateDeleteError(error, { kind: 'item', estimateItemId: id });
    return { ok: false, error: message || 'Не удалось удалить позицию' };
  }
};
