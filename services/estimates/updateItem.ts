'use server';

import { estimateRepository } from '@/data/estimates';
import { validateUpdateItem } from '@/domain/estimates';
import type { IUpdateItemInput, IEstimateItem } from '@/domain/estimates';

interface IResult {
  ok: boolean;
  data?: IEstimateItem;
  error?: string;
}

export const updateItem = async (id: number, input: IUpdateItemInput): Promise<IResult> => {
  const validationError = validateUpdateItem(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const item = await estimateRepository.updateItem(id, input);
    return { ok: true, data: item };
  } catch (error) {
    console.error('Ошибка при обновлении позиции:', error);
    return { ok: false, error: 'Не удалось обновить позицию' };
  }
};
