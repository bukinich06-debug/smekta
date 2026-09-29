export const formatDate = (date: Date | null): string => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};
