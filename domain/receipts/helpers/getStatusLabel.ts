import type { ReceiptStatus } from '../types';

export const getReceiptStatusLabel = (status: ReceiptStatus): string => {
  switch (status) {
    case 'pending':
      return 'Ожидает оплаты';
    case 'underpaid':
      return 'Недоплачено';
    case 'paid':
      return 'Оплачено';
  }
};
