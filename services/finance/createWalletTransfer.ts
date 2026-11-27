import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { financeRepository } from '@/data/finance';
import { validateCreateTransfer } from '@/domain/finance';
import type { ICreateTransferInput, IWalletTransfer } from '@/domain/finance';
import { revalidateFinancePaths } from './helpers/revalidateFinancePaths';
import { mapFinanceRepositoryError } from './helpers/mapFinanceRepositoryError';

interface IResult {
  ok: boolean;
  data?: IWalletTransfer;
  error?: string;
}

export const createWalletTransfer = async (input: ICreateTransferInput, userId: number): Promise<IResult> => {
  if (!(await ownsProject(userId, input.projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateCreateTransfer(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await financeRepository.createTransfer(input, userId);
    revalidateFinancePaths();
    return { ok: true, data };
  } catch (error) {
    const mapped = mapFinanceRepositoryError(error);
    if (mapped) return { ok: false, error: mapped };

    console.error('Ошибка при создании перевода:', error);
    return { ok: false, error: 'Не удалось сохранить перевод' };
  }
};
