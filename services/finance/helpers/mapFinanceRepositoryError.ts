import {
  formatMaterialsDepositInsufficient,
  MATERIALS_DEPOSIT_INSUFFICIENT,
  MaterialsDepositInsufficientError,
} from '@/data/receipts/helpers/materialsDepositError';

export const mapFinanceRepositoryError = (error: unknown): string | null => {
  if (error instanceof MaterialsDepositInsufficientError)
    return formatMaterialsDepositInsufficient(error.allocated);

  if (error instanceof Error && error.message === MATERIALS_DEPOSIT_INSUFFICIENT)
    return formatMaterialsDepositInsufficient(0);

  if (error instanceof Error && error.message === 'INFLOW_NOT_FOUND') return 'Поступление не найдено';
  if (error instanceof Error && error.message === 'TRANSFER_NOT_FOUND') return 'Перевод не найден';

  return null;
};
