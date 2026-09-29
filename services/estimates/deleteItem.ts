'use server';

import { estimateRepository } from '@/data/estimates';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteItem = async (id: number): Promise<IResult> => {
  try {
    await estimateRepository.deleteItem(id);
    return { ok: true };
  } catch (error) {
    console.error('Ошибка при удалении позиции:', error);
    return { ok: false, error: 'Не удалось удалить позицию' };
  }
};
