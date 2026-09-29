import type { ICreateClientInput, IUpdateClientCardInput } from './types';

export const validateCreateClient = (input: ICreateClientInput): string[] => {
  const errors: string[] = [];

  if (!input.fullName || input.fullName.trim().length < 2)
    errors.push('ФИО должно содержать минимум 2 символа');

  if (!input.phone || input.phone.trim().length < 10)
    errors.push('Телефон должен содержать минимум 10 символов');

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
    errors.push('Некорректный e-mail');

  if (!input.address || input.address.trim().length < 5)
    errors.push('Адрес объекта должен содержать минимум 5 символов');

  if (!input.projectName || input.projectName.trim().length < 2)
    errors.push('Название проекта должно содержать минимум 2 символа');

  return errors;
};

export const validateUpdateClientCard = (input: IUpdateClientCardInput): string[] => {
  const errors: string[] = [];

  if (!input.fullName || input.fullName.trim().length < 2)
    errors.push('ФИО должно содержать минимум 2 символа');

  if (!input.phone || input.phone.trim().length < 10)
    errors.push('Телефон должен содержать минимум 10 символов');

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
    errors.push('Некорректный e-mail');

  if (!input.address || input.address.trim().length < 5)
    errors.push('Адрес объекта должен содержать минимум 5 символов');

  if (!input.projectName || input.projectName.trim().length < 2)
    errors.push('Название проекта должно содержать минимум 2 символа');

  if (!input.managerId || input.managerId <= 0)
    errors.push('Необходимо выбрать ответственного администратора');

  return errors;
};
