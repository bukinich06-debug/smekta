'use server';

import { estimateRepository } from '@/data/estimates';
import type { IProjectEstimate } from '@/domain/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getProjectEstimate = async (projectId: number): Promise<IProjectEstimate> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return await estimateRepository.getByProjectId(projectId);
};
