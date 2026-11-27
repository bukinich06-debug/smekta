import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  error?: string;
}

export const deleteWalletTransfer = async (id: number, userId: number): Promise<IResult> => {
  const projectId = await financeRepository.getProjectIdByTransferId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Перевод не найден' };

  try {
    await financeRepository.deleteTransfer(id, userId);
    revalidateFinancePaths();
    return { ok: true };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при удалении перевода:', error);
    return { ok: false, error: 'Не удалось удалить перевод' };
  }
};
