import { getExtraWorkAmount, isExtraWorkDone } from '@/domain/extra-works';
import { roundMoney } from '@/domain/finance/helpers/roundMoney';
import type { IProjectFinanceInput } from '@/domain/finance';
import { hasStatsPeriod, isDateInPeriod, toMinskCalendarDay } from './isDateInPeriod';
import {
  addMonths,
  formatMonthLabel,
  getMinskCurrentMonthKey,
  listMonthKeys,
  toMinskMonthKey,
} from './monthKeys';
import type { IAdminStatsFilters, IAdminStatsMonthlyPoint, IAdminStatsProjectRow } from '../types';

const normalizeBoundaryMonth = (value: Date | string): string => {
  if (typeof value === 'string') return value.slice(0, 7);
  return toMinskCalendarDay(value).slice(0, 7);
};

const resolveMonthRange = (filters: IAdminStatsFilters): { start: string; end: string } => {
  const current = getMinskCurrentMonthKey();

  if (!hasStatsPeriod(filters)) return { start: addMonths(current, -11), end: current };

  const end = filters.dateTo ? normalizeBoundaryMonth(filters.dateTo) : current;
  const start = filters.dateFrom ? normalizeBoundaryMonth(filters.dateFrom) : addMonths(end, -11);

  return start <= end ? { start, end } : { start: end, end: start };
};

const isEventInChartRange = (
  date: Date,
  monthKey: string,
  range: { start: string; end: string },
  filters: IAdminStatsFilters
): boolean => {
  if (monthKey < range.start || monthKey > range.end) return false;
  if (hasStatsPeriod(filters)) return isDateInPeriod(date, filters);
  return true;
};

const addToBucket = (buckets: Map<string, { received: number; mastered: number }>, monthKey: string, field: 'received' | 'mastered', amount: number) => {
  const row = buckets.get(monthKey) ?? { received: 0, mastered: 0 };
  row[field] = roundMoney(row[field] + amount);
  buckets.set(monthKey, row);
};

const collectFromProject = (
  input: IProjectFinanceInput,
  filters: IAdminStatsFilters,
  range: { start: string; end: string },
  buckets: Map<string, { received: number; mastered: number }>
) => {
  for (const inflow of input.inflows) {
    const monthKey = toMinskMonthKey(inflow.date);
    if (!isEventInChartRange(inflow.date, monthKey, range, filters)) continue;
    addToBucket(buckets, monthKey, 'received', inflow.amount);
  }

  for (const act of input.acts) {
    if (act.status !== 'SIGNED') continue;
    const monthKey = toMinskMonthKey(act.date);
    if (!isEventInChartRange(act.date, monthKey, range, filters)) continue;
    addToBucket(buckets, monthKey, 'mastered', act.totalAmount);
  }

  for (const payment of input.payments) {
    const monthKey = toMinskMonthKey(payment.date);
    if (!isEventInChartRange(payment.date, monthKey, range, filters)) continue;
    addToBucket(buckets, monthKey, 'mastered', Number(payment.amount));
  }

  for (const row of input.extraWorks) {
    if (!isExtraWorkDone(row.status)) continue;
    const monthKey = toMinskMonthKey(row.date);
    if (!isEventInChartRange(row.date, monthKey, range, filters)) continue;
    addToBucket(buckets, monthKey, 'mastered', getExtraWorkAmount(row.quantity, row.unitPrice));
  }
};

export const buildMonthlyMoney = (
  projects: IAdminStatsProjectRow[],
  filters: IAdminStatsFilters
): IAdminStatsMonthlyPoint[] => {
  const range = resolveMonthRange(filters);
  const buckets = new Map<string, { received: number; mastered: number }>();

  for (const project of projects) collectFromProject(project.financeInput, filters, range, buckets);

  return listMonthKeys(range.start, range.end).map((monthKey) => {
    const values = buckets.get(monthKey) ?? { received: 0, mastered: 0 };

    return {
      monthKey,
      monthLabel: formatMonthLabel(monthKey),
      received: values.received,
      mastered: values.mastered,
    };
  });
};
