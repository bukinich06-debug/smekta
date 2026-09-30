import type { IAddPaymentInput, ICreateReceiptInput, IUpdateReceiptInput } from './types';
import { getRemainder, sumPayments } from './helpers/receiptTotals';
import type { IReceiptPayment } from './types';

const parseAmount = (value: string): number | null => {
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  return num;
};

export const validateCreateReceipt = (input: ICreateReceiptInput): string | null => {
  if (!input.title || input.title.trim().length < 1) return 'Наименование платежа обязательно';
  if (input.title.length > 500) return 'Наименование не может превышать 500 символов';

  const amount = parseAmount(input.amountDue);
  if (amount === null || amount <= 0) return 'Сумма к оплате должна быть больше нуля';

  if (input.comment && input.comment.length > 2000) return 'Комментарий не может превышать 2000 символов';

  if (!input.date || isNaN(input.date.getTime())) return 'Укажите корректную дату';

  return null;
};

export const validateUpdateReceipt = (input: IUpdateReceiptInput): string | null => {
  if (input.title !== undefined) {
    if (!input.title || input.title.trim().length < 1) return 'Наименование платежа обязательно';
    if (input.title.length > 500) return 'Наименование не может превышать 500 символов';
  }

  if (input.amountDue !== undefined) {
    const amount = parseAmount(input.amountDue);
    if (amount === null || amount <= 0) return 'Сумма к оплате должна быть больше нуля';
  }

  if (input.comment !== undefined && input.comment && input.comment.length > 2000)
    return 'Комментарий не может превышать 2000 символов';

  if (input.date !== undefined && isNaN(input.date.getTime())) return 'Укажите корректную дату';

  return null;
};

interface IValidatePaymentParams {
  input: IAddPaymentInput;
  amountDue: string;
  payments: IReceiptPayment[];
}

export const validateAddPayment = ({ input, amountDue, payments }: IValidatePaymentParams): string | null => {
  const amount = parseAmount(input.amount);
  if (amount === null || amount <= 0) return 'Сумма оплаты должна быть больше нуля';

  if (!input.date || isNaN(input.date.getTime())) return 'Укажите корректную дату';

  const paid = sumPayments(payments);
  const remainder = getRemainder(amountDue, paid);
  if (amount > remainder) return 'Сумма оплаты не может превышать остаток';

  if (input.comment && input.comment.length > 2000) return 'Комментарий не может превышать 2000 символов';

  return null;
};
