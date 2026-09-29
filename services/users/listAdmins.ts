'use server';

import { dbClient } from '@/data/shared/dbClient';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export interface IAdminUser {
  id: number;
  name: string;
}

export const listAdmins = async (): Promise<IAdminUser[]> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const admins = await dbClient.user.findMany({
    where: {
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return admins;
};
