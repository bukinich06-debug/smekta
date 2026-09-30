'use server';

import { clientRepository } from '@/data/clients';
import { estimateRepository } from '@/data/estimates';
import type { IClientProjectEstimate } from '@/domain/estimates';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientProjectEstimate = async (): Promise<IClientProjectEstimate | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');
  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);

  if (!cabinet?.project) return null;

  return await estimateRepository.getClientVisibleByProjectId(cabinet.project.id);
};
