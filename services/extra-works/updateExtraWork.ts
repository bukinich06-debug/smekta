'use server';

import { extraWorkRepository } from '@/data/extra-works';
import { validateUpdateExtraWork } from '@/domain/extra-works';
import type { IUpdateExtraWorkInput, IExtraWork } from '@/domain/extra-works';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';

interface IResult {
  ok: boolean;
  data?: IExtraWork;
  error?: string;
}

export const updateExtraWork = async (id: number, input: IUpdateExtraWorkInput): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const validationError = validateUpdateExtraWork(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await extraWorkRepository.update(id, input);
    revalidateExtraWorkPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при обновлении допработы:', error);
    return { ok: false, error: 'Не удалось обновить допработу' };
  }
};
