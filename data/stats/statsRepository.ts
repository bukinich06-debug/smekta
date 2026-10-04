import { dbClient } from '@/data/shared/dbClient';
import { mapProjectToFinanceInput, projectFinanceQueryInclude } from '@/data/finance';
import {
  aggregateAdminStats,
  type IAdminStats,
  type IAdminStatsFilters,
  type IActivityLogRow,
  type IStatsRepository,
} from '@/domain/stats';
import { sumPayments } from '@/domain/receipts';
import type { Prisma } from '@prisma/client';

export const statsRepository: IStatsRepository = {
  async getAdminStats(filters: IAdminStatsFilters): Promise<IAdminStats> {
    const projectWhere: Prisma.ProjectWhereInput = {};

    if (filters.status) projectWhere.status = filters.status;

    const projects = await dbClient.project.findMany({
      where: projectWhere,
      include: projectFinanceQueryInclude,
    });

    const projectIds = projects.map((row) => row.id);

    const receipts =
      projectIds.length === 0
        ? []
        : await dbClient.receipt.findMany({
            where: { projectId: { in: projectIds } },
            include: { payments: true },
          });

    if (projectIds.length === 0)
      return aggregateAdminStats([], [], [], filters);

    const activityRows = await dbClient.activityLog.findMany({
      where: { projectId: { in: projectIds } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { name: true } },
        project: { select: { id: true, number: true, name: true, clientId: true } },
      },
    });

    const projectRows = projects.map((project) => ({
      projectId: project.id,
      status: project.status,
      financeInput: mapProjectToFinanceInput(project),
    }));

    const receiptRows = receipts.map((receipt) => ({
      amountDue: receipt.amountDue.toString(),
      paid: sumPayments(
        receipt.payments.map((payment) => ({
          amount: payment.amount.toString(),
          source: payment.source,
        }))
      ),
    }));

    const mappedActivity: IActivityLogRow[] = activityRows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      entityType: row.entityType,
      entityId: row.entityId,
      action: row.action,
      changes: row.changes,
      authorName: row.user.name,
      projectId: row.projectId,
      clientId: row.project?.clientId ?? null,
      projectNumber: row.project?.number ?? null,
      projectName: row.project?.name ?? null,
    }));

    return aggregateAdminStats(projectRows, receiptRows, mappedActivity, filters);
  },
};
