import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { projectTzRepository } from '@/data/project-tz';
import { validateProjectTzText } from '@/domain/project-tz';
import type { IProjectTz } from '@/domain/project-tz';
import { revalidatePath } from 'next/cache';

interface IUpdateProjectTzResult {
  ok: boolean;
  data?: IProjectTz;
  error?: string;
}

export const updateProjectTz = async (
  projectId: number,
  text: string,
  userId: number
): Promise<IUpdateProjectTzResult> => {
  if (!(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateProjectTzText(text);
  if (validationError) return { ok: false, error: validationError };

  const existing = await projectTzRepository.getByProjectId(projectId);
  if (!existing) return { ok: false, error: 'Проект не найден.' };

  try {
    const data = await projectTzRepository.updateText(projectId, text, userId);
    revalidatePath('/admin/clients/[id]', 'page');
    revalidatePath('/client', 'page');
    return { ok: true, data };
  } catch (err) {
    console.error('Ошибка при сохранении ТЗ:', err);
    return { ok: false, error: 'Не удалось сохранить текст ТЗ. Попробуйте ещё раз.' };
  }
};
