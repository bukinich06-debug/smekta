export const MATERIALS_DEPOSIT_INSUFFICIENT = 'MATERIALS_DEPOSIT_INSUFFICIENT';

export class MaterialsDepositInsufficientError extends Error {
  readonly allocated: number;

  constructor(allocated: number) {
    super(MATERIALS_DEPOSIT_INSUFFICIENT);
    this.name = 'MaterialsDepositInsufficientError';
    this.allocated = allocated;
  }
}

export const formatMaterialsDepositInsufficient = (allocated: number): string => {
  const formatted = allocated.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `На депозите недостаточно средств: уже зачтено в чеки ${formatted} ₽`;
};
