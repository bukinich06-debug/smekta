interface IPeriod {
  dateFrom?: Date;
  dateTo?: Date;
}

export const isDateInPeriod = (date: Date, period: IPeriod): boolean => {
  if (period.dateFrom) {
    const from = new Date(period.dateFrom);
    from.setHours(0, 0, 0, 0);
    if (date < from) return false;
  }

  if (period.dateTo) {
    const to = new Date(period.dateTo);
    to.setHours(23, 59, 59, 999);
    if (date > to) return false;
  }

  return true;
};

export const hasStatsPeriod = (period: IPeriod): boolean => Boolean(period.dateFrom || period.dateTo);
