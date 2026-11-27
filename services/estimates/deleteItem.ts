import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import { revalidatePath } from 'next/cache';
import { mapEstimateDeleteError } from '@/services/estimates/helpers/mapEstimateDeleteError';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteItem = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await estimateRepository.getProjectIdByItemId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Позиция не найдена' };

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
