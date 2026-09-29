'use server';

import { estimateRepository } from '@/data/estimates';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteSection = async (id: number): Promise<IResult> => {
  try {
    await estimateRepository.deleteSection(id);
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении раздела:', error);
    return { ok: false, error: 'Не удалось удалить раздел' };
  }
};
