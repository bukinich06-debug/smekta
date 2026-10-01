'use server';

import { actRepository } from '@/data/acts';
import type { IActStatusHistoryItem } from '@/domain/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const listActStatusHistory = async (actId: number): Promise<IActStatusHistoryItem[]> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId) return [];

  return await actRepository.listStatusHistory(actId);
};
