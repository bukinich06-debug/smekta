import type { IReceiptPayment, ReceiptStatus } from '../types';

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

export const sumPayments = (payments: Pick<IReceiptPayment, 'amount'>[]): number => {
  let total = 0;
  for (const payment of payments) total += parseFloat(payment.amount);
  return roundMoney(total);
};

export const getRemainder = (amountDue: string, paid: number): number =>
  roundMoney(parseFloat(amountDue) - paid);

export const getReceiptStatus = (amountDue: string, paid: number): ReceiptStatus => {
  const due = parseFloat(amountDue);
  if (paid <= 0) return 'pending';
  const remainder = due - paid;
  if (remainder <= 0) return 'paid';
  return 'underpaid';
};
