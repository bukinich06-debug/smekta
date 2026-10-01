'use server';

import { actRepository } from '@/data/acts';
import { validateUpdateAct } from '@/domain/acts';
import type { IUpdateActInput, IAct } from '@/domain/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateActPaths } from './helpers/revalidateActPaths';

interface IResult {
  ok: boolean;
  data?: IAct;
  error?: string;
}

const mapUpdateError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message === 'ACT_NOT_FOUND') return 'Акт не найден';
    if (error.message === 'ACT_ITEMS_INVALID') return 'Выбраны некорректные позиции сметы';
    if (error.message.startsWith('Позиция')) return error.message;
  }

  return 'Не удалось обновить акт';
};

export const updateAct = async (id: number, input: IUpdateActInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateUpdateAct(input);
  if (validationError) return { ok: false, error: validationError };

  const existing = await actRepository.getById(id);
  if (!existing) return { ok: false, error: 'Акт не найден' };

  try {
    const data = await actRepository.update(id, input);
    revalidateActPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при обновлении акта:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002')
      return { ok: false, error: 'Акт с таким номером уже существует в проекте' };

    return { ok: false, error: mapUpdateError(error) };
  }
};
