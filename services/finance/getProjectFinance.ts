'use server';

import { financeRepository } from '@/data/finance';
import type { IProjectFinance } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getProjectFinance = async (projectId: number): Promise<IProjectFinance> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return await financeRepository.getByProjectId(projectId);
};
