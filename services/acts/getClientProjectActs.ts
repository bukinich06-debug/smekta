'use server';

import { clientRepository } from '@/data/clients';
import { actRepository } from '@/data/acts';
import type { IClientProjectActs } from '@/domain/acts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientProjectActs = async (): Promise<IClientProjectActs | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');
  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);

  if (!cabinet?.project) return null;

  return await actRepository.getClientVisibleByProjectId(cabinet.project.id);
};
