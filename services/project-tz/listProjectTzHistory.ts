'use server';
import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';

import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTzHistoryItem } from '@/domain/project-tz';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const listProjectTzHistory = async (projectId: number): Promise<IProjectTzHistoryItem[]> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  await requireOwnProject(session.user.id, projectId);

  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return [];

  return await projectTzRepository.listHistory(projectId);
};
