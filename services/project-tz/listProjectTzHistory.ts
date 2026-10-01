'use server';

import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTzHistoryItem } from '@/domain/project-tz';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const listProjectTzHistory = async (projectId: number): Promise<IProjectTzHistoryItem[]> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return [];

  return await projectTzRepository.listHistory(projectId);
};
