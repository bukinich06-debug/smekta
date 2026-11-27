import 'server-only';

import { dbClient } from '@/data/shared/dbClient';
import { financeRepository } from '@/data/finance';
import type { IClientProjectFinance } from '@/domain/finance';

interface IResult {
  ok: boolean;
  data?: IClientProjectFinance | null;
  error?: string;
}

export const getClientProjectFinance = async (userId: number): Promise<IResult> => {
  const client = await dbClient.client.findFirst({
    where: { userId },
    include: {
      projects: {
        take: 1,
        orderBy: { updatedAt: 'desc' },
        select: { id: true },
      },
    },
  });

  const projectId = client?.projects[0]?.id;
  if (!projectId) return { ok: false, error: 'Проект не найден' };

  const data = await financeRepository.getClientByProjectId(projectId);
  return { ok: true, data };
};
