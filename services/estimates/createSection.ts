'use server';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';

import { estimateRepository } from '@/data/estimates';
import { validateCreateSection } from '@/domain/estimates';
import type { ICreateSectionInput, IEstimateSection } from '@/domain/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateSection;
  error?: string;
}

export const createSection = async (input: ICreateSectionInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  if (!(await ownsProject(session.user.id, input.projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateCreateSection(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const section = await estimateRepository.createSection(input);
    revalidatePath('/admin/clients/[id]', 'page');
    return { ok: true, data: section };
  } catch (error) {
    console.error('Ошибка при создании раздела:', error);
    return { ok: false, error: 'Не удалось создать раздел' };
  }
};
