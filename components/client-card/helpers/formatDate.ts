export const formatDate = (date: Date | string | null): string => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
};
