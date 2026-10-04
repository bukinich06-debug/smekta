import { toMinskCalendarDay } from './isDateInPeriod';

export const getMinskCurrentMonthKey = (): string => toMinskCalendarDay(new Date()).slice(0, 7);

export const toMinskMonthKey = (date: Date): string => toMinskCalendarDay(date).slice(0, 7);

export const addMonths = (monthKey: string, delta: number): string => {
  const [year, month] = monthKey.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));

  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`;
};

export const listMonthKeys = (start: string, end: string): string[] => {
  const keys: string[] = [];
  let current = start;

  while (current <= end) {
    keys.push(current);
    current = addMonths(current, 1);
  }

  return keys;
};

const monthLabelFormatter = new Intl.DateTimeFormat('ru-RU', {
  timeZone: 'Europe/Minsk',
  month: 'short',
  year: 'numeric',
});

export const formatMonthLabel = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 15));

  return monthLabelFormatter.format(date);
};
