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

export const toggleItemVisibility = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    const { dbClient } = await import('@/data/shared/dbClient');
    
    const currentItem = await dbClient.estimateItem.findUnique({
      where: { id },
    });

    if (!currentItem) return { ok: false, error: 'Позиция не найдена' };

    const item = await estimateRepository.updateItem(id, {
      isVisibleToClient: !currentItem.isVisibleToClient,
    });
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true, data: item };
  } catch (error) {
    console.error('Ошибка при переключении видимости позиции:', error);
    return { ok: false, error: 'Не удалось переключить видимость позиции' };
  }
};
