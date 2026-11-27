import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import { validateUpdateTransfer } from '@/domain/finance';
import type { IUpdateTransferInput, IWalletTransfer } from '@/domain/finance';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  data?: IWalletTransfer;
  error?: string;
}

export const updateWalletTransfer = async (
  id: number,
  input: IUpdateTransferInput,
  userId: number
): Promise<IResult> => {
  const projectId = await financeRepository.getProjectIdByTransferId(id);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Перевод не найден' };

  const current = await financeRepository.getTransferById(id);
  if (!current) return { ok: false, error: 'Перевод не найден' };

  const validationError = validateUpdateTransfer(input, {
    fromWallet: current.fromWallet,
    toWallet: current.toWallet,
  });
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.updateTransfer(id, input, userId);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при изменении перевода:', error);
    return { ok: false, error: 'Не удалось сохранить перевод' };
  }
};
