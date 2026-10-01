import type {
  ICreateInflowInput,
  ICreateTransferInput,
  IUpdateInflowInput,
  IUpdateTransferInput,
} from './types';

export const validateCreateInflow = (input: ICreateInflowInput): string | null => {
  if (!input.date || Number.isNaN(input.date.getTime())) return 'Укажите дату поступления';
  if (!input.amount || input.amount <= 0) return 'Сумма должна быть больше нуля';
  if (input.purpose !== 'WORKS' && input.purpose !== 'MATERIALS') return 'Укажите назначение поступления';
  return null;
};

export const validateUpdateInflow = (input: IUpdateInflowInput): string | null => {
  if (input.date !== undefined && Number.isNaN(input.date.getTime())) return 'Укажите корректную дату';
  if (input.amount !== undefined && input.amount <= 0) return 'Сумма должна быть больше нуля';
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
  if (!input.amount || input.amount <= 0) return 'Сумма должна быть больше нуля';
  if (input.fromWallet === input.toWallet) return 'Кошельки перевода должны отличаться';
  return null;
};

export const validateUpdateTransfer = (input: IUpdateTransferInput): string | null => {
  if (input.date !== undefined && Number.isNaN(input.date.getTime())) return 'Укажите корректную дату';
  if (input.amount !== undefined && input.amount <= 0) return 'Сумма должна быть больше нуля';
  if (
    input.fromWallet !== undefined &&
    input.toWallet !== undefined &&
    input.fromWallet === input.toWallet
  )
    return 'Кошельки перевода должны отличаться';
  return null;
};
