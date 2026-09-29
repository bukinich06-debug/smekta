'use server';

import { clientRepository } from '@/data/clients';
import type { IClientListItem, IClientListFilters } from '@/domain/clients';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const listClients = async (filters: IClientListFilters): Promise<IClientListItem[]> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return await clientRepository.list(filters);
};
