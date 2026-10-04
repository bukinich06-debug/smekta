import type { IAdminStats, IAdminStatsFilters } from './types';

export interface IStatsRepository {
  getAdminStats(filters: IAdminStatsFilters): Promise<IAdminStats>;
}
