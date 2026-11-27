export const formatDate = (date: Date | string | null): string => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};
