'use server';

import { actRepository } from '@/data/acts';
import { validateCreateAct } from '@/domain/acts';
import type { ICreateActInput, IAct } from '@/domain/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateActPaths } from './helpers/revalidateActPaths';

interface IResult {
  ok: boolean;
  data?: IAct;
  error?: string;
}

const mapCreateError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message === 'ACT_ITEMS_INVALID') return 'Выбраны некорректные позиции сметы';
    if (error.message.startsWith('Позиция')) return error.message;
  }

  return 'Не удалось создать акт';
};

export const createAct = async (input: ICreateActInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateCreateAct(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await actRepository.create(input);
    revalidateActPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при создании акта:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002')
      return { ok: false, error: 'Акт с таким номером уже существует в проекте' };

    return { ok: false, error: mapCreateError(error) };
  }
};
