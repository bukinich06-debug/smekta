import type { IAdminStats, IAdminStatsFilters } from './types';

export interface IStatsRepository {
  getAdminStats(filters: IAdminStatsFilters, managerId: number): Promise<IAdminStats>;
}
