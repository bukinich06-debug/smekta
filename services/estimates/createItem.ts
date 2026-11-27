import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import { validateCreateItem } from '@/domain/estimates';
import type { ICreateItemInput, IEstimateItem } from '@/domain/estimates';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const createItem = async (input: ICreateItemInput, userId: number): Promise<IResult> => {
  const projectId = await estimateRepository.getProjectIdBySectionId(input.sectionId);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Раздел не найден' };

  const validationError = validateCreateItem(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const item = await estimateRepository.createItem(input);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true, data: item };
  } catch (error) {
    console.error('Ошибка при создании позиции:', error);
    return { ok: false, error: 'Не удалось создать позицию' };
  }
};
