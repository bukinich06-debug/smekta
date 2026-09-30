'use server';

import { clientRepository } from '@/data/clients';
import type { IClientCardDetails } from '@/domain/clients';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientCabinet = async (): Promise<IClientCardDetails | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') redirect('/admin/clients');
  if (session.user.role !== 'CLIENT') redirect('/login');

  return await clientRepository.getCabinetByUserId(session.user.id);
};
