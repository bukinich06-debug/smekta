import type { ActivityAction, ProjectStatus } from '@prisma/client';
import type { IProjectFinanceInput } from '@/domain/finance';

export interface IAdminStatsFilters {
  status?: ProjectStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IAdminStatsProjectRow {
  projectId: number;
  status: ProjectStatus;
  financeInput: IProjectFinanceInput;
}

export interface IAdminStatsReceiptRow {
  amountDue: string;
  paid: number;
}

export interface IAdminStatsKpi {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  unpaidReceiptsCount: number;
  completedExtraWorksVolume: number;
  periodAppliedToMoney: boolean;
}

export interface IAdminStatsActivityItem {
  id: number;
  createdAt: Date;
  authorName: string;
  clientId: number;
  projectLabel: string;
  description: string;
}

export interface IAdminStats {
  kpi: IAdminStatsKpi;
  recentActivity: IAdminStatsActivityItem[];
}

export interface IActivityLogRow {
  id: number;
  createdAt: Date;
  entityType: string;
  entityId: number;
  action: ActivityAction;
  changes: unknown;
  authorName: string;
  projectId: number | null;
  clientId: number | null;
  projectNumber: string | null;
  projectName: string | null;
}
