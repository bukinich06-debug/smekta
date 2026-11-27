import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import type { IFinanceHistoryItem } from '@/domain/finance';

interface IResult {
  ok: boolean;
  data?: IFinanceHistoryItem[];
  error?: string;
}

export const listProjectFinanceHistory = async (projectId: number, userId: number): Promise<IResult> => {
  try {
    await requireOwnProject(userId, projectId);
  } catch {
    return { ok: false, error: 'Проект не найден' };
  }

  const data = await financeRepository.listMoneyHistory(projectId);
  return { ok: true, data };
};
