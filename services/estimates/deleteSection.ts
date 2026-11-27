import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import { revalidatePath } from 'next/cache';
import { mapEstimateDeleteError } from '@/services/estimates/helpers/mapEstimateDeleteError';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteSection = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await estimateRepository.getProjectIdBySectionId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Раздел не найден' };

  try {
    await estimateRepository.deleteSection(id);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении раздела:', error);
    const message = await mapEstimateDeleteError(error, { kind: 'section', sectionId: id });
    return { ok: false, error: message || 'Не удалось удалить раздел' };
  }
};
