import type { Client } from '@prisma/client';
import { dbClient } from '@/data/shared/dbClient';
import {
  SEED_INVITE_TOKEN,
  SEED_LINKED_CLIENTS,
  SEED_NOVIKOVA_CLIENT,
} from './constants';
import type { ISeedReport } from './report';
import { markCreated, markSkipped } from './report';

export interface ISeedClients {
  kovaleva: Client;
  petrov: Client;
  sidorenko: Client;
  novikova: Client;
}

export const ensureSeedClients = async (
  clientUserIds: number[],
  report: ISeedReport
): Promise<ISeedClients> => {
  const linked: Client[] = [];

  for (let i = 0; i < SEED_LINKED_CLIENTS.length; i++) {
    const spec = SEED_LINKED_CLIENTS[i];
    const userId = clientUserIds[i];
    const existing = await dbClient.client.findFirst({ where: { email: spec.email } });

    if (existing) {
      markSkipped(report, `заказчик ${spec.fullName}`);
      linked.push(existing);
      continue;
    }

    const created = await dbClient.client.create({
      data: {
        fullName: spec.fullName,
        phone: spec.phone,
        email: spec.email,
        userId,
      },
    });
    markCreated(report, `заказчик ${spec.fullName}`);
    linked.push(created);
  }

  let novikova = await dbClient.client.findFirst({
    where: { email: SEED_NOVIKOVA_CLIENT.email },
  });

  if (!novikova) {
    novikova = await dbClient.client.create({
      data: {
        fullName: SEED_NOVIKOVA_CLIENT.fullName,
        phone: SEED_NOVIKOVA_CLIENT.phone,
        email: SEED_NOVIKOVA_CLIENT.email,
        inviteToken: SEED_INVITE_TOKEN,
      },
    });
    markCreated(report, `заказчик ${SEED_NOVIKOVA_CLIENT.fullName} (инвайт)`);
  } else {
    markSkipped(report, `заказчик ${SEED_NOVIKOVA_CLIENT.fullName}`);
    if (!novikova.userId && !novikova.inviteToken) {
      novikova = await dbClient.client.update({
        where: { id: novikova.id },
        data: { inviteToken: SEED_INVITE_TOKEN },
      });
      markCreated(report, `инвайт-токен для ${SEED_NOVIKOVA_CLIENT.fullName}`);
    }
  }

  return {
    kovaleva: linked[0],
    petrov: linked[1],
    sidorenko: linked[2],
    novikova,
  };
};
