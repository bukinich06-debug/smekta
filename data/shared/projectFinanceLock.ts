import type { Prisma } from '@prisma/client';

export const lockProjectFinance = async (
  tx: Prisma.TransactionClient,
  projectId: number
): Promise<void> => {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${projectId}::bigint)`;
};
