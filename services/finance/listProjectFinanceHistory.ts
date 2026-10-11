'use server';
import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';

import { financeRepository } from '@/data/finance';
import type { IFinanceHistoryItem } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const listProjectFinanceHistory = async (projectId: number): Promise<IFinanceHistoryItem[]> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  await requireOwnProject(session.user.id, projectId);

  return await financeRepository.listMoneyHistory(projectId);
};
