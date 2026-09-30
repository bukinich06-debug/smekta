'use server';

import { estimateRepository } from '@/data/estimates';
import type { IEstimateItem } from '@/domain/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const toggleItemStatus = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    const { dbClient } = await import('@/data/shared/dbClient');
    
    const currentItem = await dbClient.estimateItem.findUnique({
      where: { id },
    });

    if (!currentItem) return { ok: false, error: 'Позиция не найдена' };

    const newStatus = currentItem.status === 'AGREED' ? 'DRAFT' : 'AGREED';
    const item = await estimateRepository.updateItem(id, {
      status: newStatus,
    });
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true, data: item };
  } catch (error) {
    console.error('Ошибка при переключении статуса позиции:', error);
    return { ok: false, error: 'Не удалось переключить статус позиции' };
  }
};
