'use server';

import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTz } from '@/domain/project-tz';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientProjectTz = async (): Promise<IProjectTz | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');
  if (session.user.role !== 'CLIENT') redirect('/login');

  return await projectTzRepository.getByClientUserId(session.user.id);
};
