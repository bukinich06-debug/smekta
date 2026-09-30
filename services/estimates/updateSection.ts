'use server';

import { estimateRepository } from '@/data/estimates';
import { validateUpdateSection } from '@/domain/estimates';
import type { IUpdateSectionInput, IEstimateSection } from '@/domain/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateSection;
  error?: string;
}

export const updateSection = async (id: number, input: IUpdateSectionInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

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
