import { auth } from '@/lib/auth';
import { dbClient } from '@/data/shared/dbClient';
import { SEED_ADMIN, SEED_CLIENT_USERS } from './constants';
import type { ISeedReport } from './report';
import { markCreated, markSkipped } from './report';

export const createSeedUsers = async (
  report: ISeedReport
): Promise<{ adminId: number; clientUserIds: number[] }> => {
  let admin = await dbClient.user.findUnique({ where: { email: SEED_ADMIN.email } });

  if (!admin) {
    await auth.api.signUpEmail({
      body: {
        email: SEED_ADMIN.email,
        password: SEED_ADMIN.password,
        name: SEED_ADMIN.name,
      },
    });

    admin = await dbClient.user.update({
      where: { email: SEED_ADMIN.email },
      data: { role: 'ADMIN', emailVerified: true, phone: SEED_ADMIN.phone },
    });
    markCreated(report, `пользователь ${SEED_ADMIN.email}`);
  } else {
    markSkipped(report, `пользователь ${SEED_ADMIN.email}`);
    if (!admin.phone) {
      admin = await dbClient.user.update({
        where: { id: admin.id },
        data: { phone: SEED_ADMIN.phone },
      });
      markCreated(report, 'телефон администратора');
    }
  }

  const clientUserIds: number[] = [];

  for (const client of SEED_CLIENT_USERS) {
    let user = await dbClient.user.findUnique({ where: { email: client.email } });

    if (!user) {
      await auth.api.signUpEmail({
        body: {
          email: client.email,
          password: client.password,
          name: client.name,
        },
      });

      user = await dbClient.user.update({
        where: { email: client.email },
        data: { emailVerified: true },
      });
      markCreated(report, `пользователь ${client.email}`);
    } else markSkipped(report, `пользователь ${client.email}`);

    clientUserIds.push(user.id);
  }

  return { adminId: admin.id, clientUserIds };
};
