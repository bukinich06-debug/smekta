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

export const toggleExtraWorkStatus = async (id: number): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  try {
    const data = await extraWorkRepository.toggleStatus(id);
    revalidateExtraWorkPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при переключении статуса допработы:', error);
    return { ok: false, error: 'Не удалось переключить статус' };
  }
};
