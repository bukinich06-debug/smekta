'use server';

import { clientRepository } from '@/data/clients';
import { receiptRepository } from '@/data/receipts';
import type { IProjectReceipts } from '@/domain/receipts';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientProjectReceipts = async (): Promise<IProjectReceipts | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');
  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);

  if (!cabinet?.project) return null;

  return await receiptRepository.getByProjectId(cabinet.project.id);
};
