import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import { validateUpdateSection } from '@/domain/estimates';
import type { IUpdateSectionInput, IEstimateSection } from '@/domain/estimates';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateSection;
  error?: string;
}

export const updateSection = async (
  id: number,
  input: IUpdateSectionInput,
  userId: number
): Promise<IResult> => {
  const projectId = await estimateRepository.getProjectIdBySectionId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Раздел не найден' };

  const validationError = validateUpdateSection(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const section = await estimateRepository.updateSection(id, input);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true, data: section };
  } catch (error) {
    console.error('Ошибка при обновлении раздела:', error);
    return { ok: false, error: 'Не удалось обновить раздел' };
  }
};
