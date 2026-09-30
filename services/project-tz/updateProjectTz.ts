'use server';

import { projectTzRepository } from '@/data/project-tz';
import { validateProjectTzText } from '@/domain/project-tz';
import type { IProjectTz } from '@/domain/project-tz';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface IUpdateProjectTzResult {
  ok: boolean;
  data?: IProjectTz;
  error?: string;
}

export const updateProjectTz = async (
  projectId: number,
  text: string
): Promise<IUpdateProjectTzResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateProjectTzText(text);
  if (validationError) return { ok: false, error: validationError };

  const existing = await projectTzRepository.getByProjectId(projectId);
  if (!existing) return { ok: false, error: 'Проект не найден.' };

  try {
    const data = await projectTzRepository.updateText(projectId, text, session.user.id);
    revalidatePath('/admin/clients/[id]', 'page');
    revalidatePath('/client', 'page');
    return { ok: true, data };
  } catch (err) {
    console.error('Ошибка при сохранении ТЗ:', err);
    return { ok: false, error: 'Не удалось сохранить текст ТЗ. Попробуйте ещё раз.' };
  }
};
