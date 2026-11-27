import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import type { IEstimateItem } from '@/domain/estimates';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const toggleItemVisibility = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await estimateRepository.getProjectIdByItemId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Позиция не найдена' };

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
