import type { IAdminStats } from '@/domain/stats';
import { StatsFilters } from './statsFilters';
import { StatsKpiGrid } from './statsKpiGrid';
import { RecentActivityList } from './recentActivityList';

interface IAdminStatsProps {
  data: IAdminStats;
}

export const AdminStats = ({ data }: IAdminStatsProps) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Статистика</h1>
    <StatsFilters />
    <StatsKpiGrid kpi={data.kpi} />
    <RecentActivityList items={data.recentActivity} />
  </div>
);
