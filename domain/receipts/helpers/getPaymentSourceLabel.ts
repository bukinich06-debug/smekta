import type { PaymentSource } from '../types';

export const getPaymentSourceLabel = (source: PaymentSource): string => {
  if (source === 'DEPOSIT') return 'Зачёт из депозита';
  return 'Прямая оплата';
};
