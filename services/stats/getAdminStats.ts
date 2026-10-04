'use server';

import { redirect } from 'next/navigation';
import { statsRepository } from '@/data/stats';
import type { IAdminStats, IAdminStatsFilters } from '@/domain/stats';
import { getSession } from '@/services/auth/getSession';

export const getAdminStats = async (filters: IAdminStatsFilters): Promise<IAdminStats> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return await statsRepository.getAdminStats(filters);
};
