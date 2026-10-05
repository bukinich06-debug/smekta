'use server';

import { actRepository } from '@/data/acts';
import { clientRepository } from '@/data/clients';
import { fileRepository } from '@/data/files';
import type { IFile } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

const CLIENT_VISIBLE_STATUSES = new Set(['SENT', 'SIGNED']);

export const listActFiles = async (actId: number): Promise<IFile[]> => {
  const session = await getSession();

  if (!session) redirect('/login');

  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId) return [];

  if (session.user.role === 'ADMIN') return await fileRepository.listByActId(actId);

  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);
  if (!cabinet?.project || cabinet.project.id !== projectId) return [];

  const act = await actRepository.getById(actId);
  if (!act || !CLIENT_VISIBLE_STATUSES.has(act.status)) return [];

  const files = await fileRepository.listByActId(actId);

  return files.filter((file) => file.isVisibleToClient);
};
