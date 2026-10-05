'use server';

import { clientRepository } from '@/data/clients';
import { fileRepository } from '@/data/files';
import { projectTzRepository } from '@/data/project-tz';
import type { IFile } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const listTzFiles = async (projectId: number): Promise<IFile[]> => {
  const session = await getSession();

  if (!session) redirect('/login');

  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return [];

  if (session.user.role === 'ADMIN') return await fileRepository.listByProjectIdTz(projectId);

  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);
  if (!cabinet?.project || cabinet.project.id !== projectId) return [];

  const files = await fileRepository.listByProjectIdTz(projectId);

  return files.filter((file) => file.isVisibleToClient);
};
