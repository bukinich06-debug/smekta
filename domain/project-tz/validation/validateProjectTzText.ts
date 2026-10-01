import { MAX_PROJECT_TZ_LENGTH } from '../constants';

export const validateProjectTzText = (text: string): string | null => {
  if (text.length > MAX_PROJECT_TZ_LENGTH)
    return `Текст ТЗ не должен превышать ${MAX_PROJECT_TZ_LENGTH.toLocaleString('ru-RU')} символов.`;

  return null;
};
