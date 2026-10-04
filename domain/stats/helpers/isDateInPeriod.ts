const MINSK_TIME_ZONE = 'Europe/Minsk';

const minskCalendarDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: MINSK_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const toMinskCalendarDay = (date: Date): string => minskCalendarDayFormatter.format(date);

interface IPeriod {
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

const normalizeBoundary = (value: Date | string): string => {
  if (typeof value === 'string') return value;
  return toMinskCalendarDay(value);
};

export const isDateInPeriod = (date: Date, period: IPeriod): boolean => {
  const day = toMinskCalendarDay(date);

  if (period.dateFrom) {
    const from = normalizeBoundary(period.dateFrom);
    if (day < from) return false;
  }

  if (period.dateTo) {
    const to = normalizeBoundary(period.dateTo);
    if (day > to) return false;
  }

  return true;
};

export const hasStatsPeriod = (period: IPeriod): boolean => Boolean(period.dateFrom || period.dateTo);
