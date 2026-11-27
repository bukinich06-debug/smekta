import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import { validateUpdateItem } from '@/domain/estimates';
import type { IUpdateItemInput, IEstimateItem } from '@/domain/estimates';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const updateItem = async (
  id: number,
  input: IUpdateItemInput,
  userId: number
): Promise<IResult> => {
  const projectId = await estimateRepository.getProjectIdByItemId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Позиция не найдена' };

  const validationError = validateUpdateItem(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const item = await estimateRepository.updateItem(id, input);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true, data: item };
  } catch (error) {
    console.error('Ошибка при обновлении позиции:', error);
    return { ok: false, error: 'Не удалось обновить позицию' };
  }
};
