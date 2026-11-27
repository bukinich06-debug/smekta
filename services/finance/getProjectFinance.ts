import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import type { IProjectFinance } from '@/domain/finance';

interface IResult {
  ok: boolean;
  data?: IProjectFinance;
  error?: string;
}

export const getProjectFinance = async (projectId: number, userId: number): Promise<IResult> => {
  try {
    await requireOwnProject(userId, projectId);
  } catch {
    return { ok: false, error: 'Проект не найден' };
  }

  const data = await financeRepository.getByProjectId(projectId);
  return { ok: true, data };
};
