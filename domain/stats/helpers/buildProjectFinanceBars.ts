import { computeProjectFinance } from '@/domain/finance';
import type { IAdminStatsProjectFinanceBar, IAdminStatsProjectRow } from '../types';

const buildProjectLabel = (project: IAdminStatsProjectRow): string =>
  `${project.number} — ${project.name} · ${project.clientFullName}`;

export const buildProjectFinanceBars = (projects: IAdminStatsProjectRow[]): IAdminStatsProjectFinanceBar[] =>
  projects
    .map((project) => {
      const summary = computeProjectFinance(project.financeInput);

      return {
        projectId: project.projectId,
        clientId: project.clientId,
        label: buildProjectLabel(project),
        balanceOnHand: summary.balanceOnHand,
        dueNow: summary.dueNow,
      };
    })
    .sort((a, b) => b.dueNow - a.dueNow);
