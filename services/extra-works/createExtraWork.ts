'use server';

import { extraWorkRepository } from '@/data/extra-works';
import { validateCreateExtraWork } from '@/domain/extra-works';
import type { ICreateExtraWorkInput, IExtraWork } from '@/domain/extra-works';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';

interface IResult {
  ok: boolean;
  data?: IExtraWork;
  error?: string;
}

export const createExtraWork = async (input: ICreateExtraWorkInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateCreateExtraWork(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await extraWorkRepository.create(input);
    revalidateExtraWorkPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при создании допработы:', error);
    return { ok: false, error: 'Не удалось создать допработу' };
  }
};
