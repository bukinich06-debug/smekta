'use server';

import { extraWorkRepository } from '@/data/extra-works';
import type { IProjectExtraWorks } from '@/domain/extra-works';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getProjectExtraWorks = async (projectId: number): Promise<IProjectExtraWorks> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return await extraWorkRepository.getByProjectId(projectId);
};
