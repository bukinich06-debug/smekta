export const daysAgo = (days: number, hour = 12): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

export const monthsAgo = (months: number, day = 15): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  date.setDate(day);
  date.setHours(10, 0, 0, 0);
  return date;
};
