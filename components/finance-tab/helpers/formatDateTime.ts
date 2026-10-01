export const formatDateTime = (value: Date | string): string => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString('ru-RU');
};
