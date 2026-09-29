import type { IRegisterInput, ILoginInput } from './types';

export const validateRegisterInput = (input: IRegisterInput): string | null => {
  if (!input.name || input.name.trim().length < 2)
    return 'Имя должно содержать минимум 2 символа';
  
  if (!input.email || !isValidEmail(input.email))
    return 'Введите корректный email';
  
  if (!input.password || input.password.length < 8)
    return 'Пароль должен содержать минимум 8 символов';
  
  return null;
};

export const validateLoginInput = (input: ILoginInput): string | null => {
  if (!input.email || !isValidEmail(input.email))
    return 'Введите корректный email';
  
  if (!input.password || input.password.length < 1)
    return 'Введите пароль';
  
  return null;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
