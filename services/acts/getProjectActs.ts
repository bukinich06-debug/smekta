'use server';
import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';

import { actRepository } from '@/data/acts';
import type { IProjectActs } from '@/domain/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getProjectActs = async (projectId: number): Promise<IProjectActs> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  await requireOwnProject(session.user.id, projectId);

  return await actRepository.getByProjectId(projectId);
};
