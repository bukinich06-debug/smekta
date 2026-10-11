'use server';
import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';

import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTz } from '@/domain/project-tz';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getProjectTz = async (projectId: number): Promise<IProjectTz | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  await requireOwnProject(session.user.id, projectId);

  return await projectTzRepository.getByProjectId(projectId);
};
