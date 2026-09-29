'use server';

import { estimateRepository } from '@/data/estimates';
import { validateCreateSection } from '@/domain/estimates';
import type { ICreateSectionInput, IEstimateSection } from '@/domain/estimates';

interface IResult {
  ok: boolean;
  data?: IEstimateSection;
  error?: string;
}

export const createSection = async (input: ICreateSectionInput): Promise<IResult> => {
  const validationError = validateCreateSection(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const section = await estimateRepository.createSection(input);
    return { ok: true, data: section };
  } catch (error) {
    console.error('Ошибка при создании раздела:', error);
    return { ok: false, error: 'Не удалось создать раздел' };
  }
};
