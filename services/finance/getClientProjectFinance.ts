'use server';

import { dbClient } from '@/data/shared/dbClient';
import { financeRepository } from '@/data/finance';
import type { IClientProjectFinance } from '@/domain/finance';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

export const getClientProjectFinance = async (): Promise<IClientProjectFinance | null> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'CLIENT') redirect('/admin/clients');

  const client = await dbClient.client.findFirst({
    where: { userId: session.user.id },
    include: {
      projects: {
        take: 1,
        orderBy: { updatedAt: 'desc' },
        select: { id: true },
      },
    },
  });

  const projectId = client?.projects[0]?.id;
  if (!projectId) return null;

  return await financeRepository.getClientByProjectId(projectId);
};
