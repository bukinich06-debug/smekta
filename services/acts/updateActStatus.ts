'use server';

import type { ActStatus } from '@prisma/client';
import { actRepository } from '@/data/acts';
import type { IAct } from '@/domain/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { revalidateActPaths } from './helpers/revalidateActPaths';

interface IResult {
  ok: boolean;
  data?: IAct;
  error?: string;
}

const allowed: ActStatus[] = ['DRAFT', 'SENT', 'SIGNED'];

export const updateActStatus = async (id: number, status: ActStatus): Promise<IResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  if (!allowed.includes(status)) return { ok: false, error: 'Некорректный статус' };

  try {
    const data = await actRepository.updateStatus(id, status, session.user.id);
    revalidateActPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при смене статуса акта:', error);

    if (error instanceof Error && error.message === 'ACT_NOT_FOUND')
      return { ok: false, error: 'Акт не найден' };

    return { ok: false, error: 'Не удалось изменить статус' };
  }
};
