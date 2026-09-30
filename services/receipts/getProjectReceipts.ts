'use server';

import { receiptRepository } from '@/data/receipts';
import type { IProjectReceipts } from '@/domain/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getProjectReceipts = async (projectId: number): Promise<IProjectReceipts> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return await receiptRepository.getByProjectId(projectId);
};
