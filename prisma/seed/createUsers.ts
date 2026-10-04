import { auth } from '@/lib/auth';
import { dbClient } from '@/data/shared/dbClient';
import { SEED_ADMIN, SEED_CLIENT_USERS } from './constants';

export const createSeedUsers = async (): Promise<{ adminId: number; clientUserIds: number[] }> => {
  await auth.api.signUpEmail({
    body: {
      email: SEED_ADMIN.email,
      password: SEED_ADMIN.password,
      name: SEED_ADMIN.name,
    },
  });

  const admin = await dbClient.user.update({
    where: { email: SEED_ADMIN.email },
    data: { role: 'ADMIN', emailVerified: true },
  });

  const clientUserIds: number[] = [];

  for (const client of SEED_CLIENT_USERS) {
    await auth.api.signUpEmail({
      body: {
        email: client.email,
        password: client.password,
        name: client.name,
      },
    });

    const user = await dbClient.user.update({
      where: { email: client.email },
      data: { emailVerified: true },
    });

    clientUserIds.push(user.id);
  }

  return { adminId: admin.id, clientUserIds };
};
