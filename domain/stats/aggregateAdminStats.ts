import { getExtraWorkAmount, isExtraWorkDone } from '@/domain/extra-works';
import { computeProjectFinance } from '@/domain/finance';
import { roundMoney } from '@/domain/finance/helpers/roundMoney';
import { getReceiptStatus } from '@/domain/receipts';
import { formatActivityDescription } from './helpers/formatActivityDescription';
import { hasStatsPeriod, isDateInPeriod } from './helpers/isDateInPeriod';
import type {
  IAdminStats,
  IAdminStatsActivityItem,
  IAdminStatsFilters,
  IAdminStatsProjectRow,
  IAdminStatsReceiptRow,
  IActivityLogRow,
} from './types';
import type { IProjectFinanceInput } from '@/domain/finance';

const isInProgressStatus = (status: IAdminStatsProjectRow['status']): boolean =>
  status === 'IN_PROGRESS';

const sumReceivedInPeriod = (input: IProjectFinanceInput, filters: IAdminStatsFilters): number => {
  let sum = 0;

  for (const inflow of input.inflows) {
    if (!isDateInPeriod(inflow.date, filters)) continue;
    sum += inflow.amount;
  }

  return roundMoney(sum);
};

const sumMasteredInPeriod = (input: IProjectFinanceInput, filters: IAdminStatsFilters): number => {
  let sum = 0;

  for (const act of input.acts) {
    if (act.status !== 'SIGNED') continue;
    if (!isDateInPeriod(act.date, filters)) continue;
    sum += act.totalAmount;
  }

  for (const payment of input.payments) {
    if (!isDateInPeriod(payment.date, filters)) continue;
    sum += Number(payment.amount);
  }

  for (const row of input.extraWorks) {
    if (!isExtraWorkDone(row.status)) continue;
    if (!isDateInPeriod(row.date, filters)) continue;
    sum += getExtraWorkAmount(row.quantity, row.unitPrice);
  }

  return roundMoney(sum);
};

const sumCompletedExtraWorks = (input: IProjectFinanceInput, filters: IAdminStatsFilters): number => {
  let sum = 0;

  for (const row of input.extraWorks) {
    if (!isExtraWorkDone(row.status)) continue;
    if (hasStatsPeriod(filters) && !isDateInPeriod(row.date, filters)) continue;
    sum += getExtraWorkAmount(row.quantity, row.unitPrice);
  }

  return roundMoney(sum);
};

const countUnpaidReceipts = (receipts: IAdminStatsReceiptRow[]): number => {
  let count = 0;

  for (const receipt of receipts) {
    const status = getReceiptStatus(receipt.amountDue, receipt.paid);
    if (status === 'pending' || status === 'underpaid') count += 1;
  }

  return count;
};

const mapActivity = (rows: IActivityLogRow[]): IAdminStatsActivityItem[] =>
  rows
    .filter((row) => row.projectId !== null && row.clientId !== null)
    .map((row) => {
      const projectLabel =
        row.projectNumber && row.projectName
          ? `${row.projectNumber} — ${row.projectName}`
          : row.projectNumber || row.projectName || `Проект ${row.projectId}`;

      return {
        id: row.id,
        createdAt: row.createdAt,
        authorName: row.authorName,
        clientId: row.clientId!,
        projectLabel,
        description: formatActivityDescription(row.entityType, row.action, row.entityId),
      };
    });

export const aggregateAdminStats = (
  projects: IAdminStatsProjectRow[],
  receipts: IAdminStatsReceiptRow[],
  activityRows: IActivityLogRow[],
  filters: IAdminStatsFilters
): IAdminStats => {
  const periodApplied = hasStatsPeriod(filters);

  let estimateTotal = 0;
  let receivedTotal = 0;
  let masteredTotal = 0;
  let balanceOnHand = 0;
  let dueNow = 0;
  let completedExtraWorksVolume = 0;

  let activeProjects = 0;
  let completedProjects = 0;

  for (const project of projects) {
    if (isInProgressStatus(project.status)) activeProjects += 1;
    if (project.status === 'COMPLETED') completedProjects += 1;

    const summary = computeProjectFinance(project.financeInput);

    estimateTotal = roundMoney(estimateTotal + summary.estimateTotal);
    balanceOnHand = roundMoney(balanceOnHand + summary.balanceOnHand);
    dueNow = roundMoney(dueNow + summary.dueNow);

    if (periodApplied) {
      receivedTotal = roundMoney(receivedTotal + sumReceivedInPeriod(project.financeInput, filters));
      masteredTotal = roundMoney(masteredTotal + sumMasteredInPeriod(project.financeInput, filters));
    } else {
      receivedTotal = roundMoney(receivedTotal + summary.receivedTotal);
      masteredTotal = roundMoney(masteredTotal + summary.masteredTotal);
    }

    completedExtraWorksVolume = roundMoney(
      completedExtraWorksVolume + sumCompletedExtraWorks(project.financeInput, filters)
    );
  }

  return {
    kpi: {
      totalProjects: projects.length,
      activeProjects,
      completedProjects,
      estimateTotal,
      receivedTotal,
      masteredTotal,
      balanceOnHand,
      dueNow,
      unpaidReceiptsCount: countUnpaidReceipts(receipts),
      completedExtraWorksVolume,
      periodAppliedToMoney: periodApplied,
    },
    recentActivity: mapActivity(activityRows),
  };
};
