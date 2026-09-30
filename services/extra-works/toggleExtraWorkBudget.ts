'use server';

import { extraWorkRepository } from '@/data/extra-works';
import type { IExtraWork } from '@/domain/extra-works';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';

interface IResult {
  ok: boolean;
  data?: IExtraWork;
  error?: string;
}

export const toggleExtraWorkBudget = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    const data = await extraWorkRepository.toggleIncludedInBudget(id);
    revalidateExtraWorkPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при переключении учёта в бюджете:', error);
    return { ok: false, error: 'Не удалось изменить учёт в бюджете' };
  }
};
