import type { IAdminStats } from '@/domain/stats';
import { StatsFilters } from './statsFilters';
import { StatsKpiGrid } from './statsKpiGrid';
import { MonthlyMoneyChart } from './monthlyMoneyChart';
import { ProjectFinanceChart } from './projectFinanceChart';
import { RecentActivityList } from './recentActivityList';

interface IAdminStatsProps {
  data: IAdminStats;
}

export const AdminStats = ({ data }: IAdminStatsProps) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Статистика</h1>
    <StatsFilters />
    <StatsKpiGrid kpi={data.kpi} />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
      <MonthlyMoneyChart points={data.monthlyMoney} />
      <ProjectFinanceChart bars={data.projectFinanceBars} />
    </div>
    <RecentActivityList items={data.recentActivity} />
  </div>
);
