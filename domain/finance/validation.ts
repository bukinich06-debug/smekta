import type { WalletType } from '@prisma/client';
import type {
  ICreateInflowInput,
  ICreateTransferInput,
  IUpdateInflowInput,
  IUpdateTransferInput,
} from './types';

const isValidAmount = (amount: number): boolean => Number.isFinite(amount) && amount > 0;

export const validateCreateInflow = (input: ICreateInflowInput): string | null => {
  if (!input.date || Number.isNaN(input.date.getTime())) return 'Укажите дату поступления';
  if (!isValidAmount(input.amount)) return 'Сумма должна быть больше нуля';
  if (input.purpose !== 'WORKS' && input.purpose !== 'MATERIALS') return 'Укажите назначение поступления';
  return null;
};

export const validateUpdateInflow = (input: IUpdateInflowInput): string | null => {
  if (input.date !== undefined && Number.isNaN(input.date.getTime())) return 'Укажите корректную дату';
  if (input.amount !== undefined && !isValidAmount(input.amount)) return 'Сумма должна быть больше нуля';
  if (
    input.purpose !== undefined &&
    input.purpose !== 'WORKS' &&
    input.purpose !== 'MATERIALS'
  )
    return 'Укажите назначение поступления';
  return null;
};

export const validateCreateTransfer = (input: ICreateTransferInput): string | null => {
  if (!input.date || Number.isNaN(input.date.getTime())) return 'Укажите дату перевода';
  if (!isValidAmount(input.amount)) return 'Сумма должна быть больше нуля';
  if (input.fromWallet === input.toWallet) return 'Кошельки перевода должны отличаться';
  return null;
};

export const validateUpdateTransfer = (
  input: IUpdateTransferInput,
  current: { fromWallet: WalletType; toWallet: WalletType }
): string | null => {
  if (input.date !== undefined && Number.isNaN(input.date.getTime())) return 'Укажите корректную дату';
  if (input.amount !== undefined && !isValidAmount(input.amount)) return 'Сумма должна быть больше нуля';

  const fromWallet = input.fromWallet ?? current.fromWallet;
  const toWallet = input.toWallet ?? current.toWallet;
  if (fromWallet === toWallet) return 'Кошельки перевода должны отличаться';

  return null;
};
