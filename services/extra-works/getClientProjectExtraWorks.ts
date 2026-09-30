'use server';

import { clientRepository } from '@/data/clients';
import { extraWorkRepository } from '@/data/extra-works';
import type { IClientProjectExtraWorks } from '@/domain/extra-works';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientProjectExtraWorks = async (): Promise<IClientProjectExtraWorks | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');
  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);

  if (!cabinet?.project) return null;

  return await extraWorkRepository.getClientVisibleByProjectId(cabinet.project.id);
};
