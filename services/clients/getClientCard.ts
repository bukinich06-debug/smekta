'use server';

import { clientRepository } from '@/data/clients';
import { ownsClient } from '@/services/clients/helpers/assertProjectManager';
import type { IClientCardDetails } from '@/domain/clients';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientCard = async (id: number): Promise<IClientCardDetails | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const own = await ownsClient(session.user.id, id);
  if (!own) return null;

  return await clientRepository.getCardDetails(id);
};
