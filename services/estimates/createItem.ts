'use server';

import { estimateRepository } from '@/data/estimates';
import { validateCreateItem } from '@/domain/estimates';
import type { ICreateItemInput, IEstimateItem } from '@/domain/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const createItem = async (input: ICreateItemInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

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
