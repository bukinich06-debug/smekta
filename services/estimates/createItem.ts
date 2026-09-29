'use server';

import { estimateRepository } from '@/data/estimates';
import { validateCreateItem } from '@/domain/estimates';
import type { ICreateItemInput, IEstimateItem } from '@/domain/estimates';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const createItem = async (input: ICreateItemInput): Promise<IResult> => {
  const validationError = validateCreateItem(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const item = await estimateRepository.createItem(input);
    return { ok: true, data: item };
  } catch (error) {
    console.error('Ошибка при создании позиции:', error);
    return { ok: false, error: 'Не удалось создать позицию' };
  }
};
