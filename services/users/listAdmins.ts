import 'server-only';

import { dbClient } from '@/data/shared/dbClient';

export interface IAdminUser {
  id: number;
  name: string;
}

export const listAdmins = async (): Promise<IAdminUser[]> => {
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
