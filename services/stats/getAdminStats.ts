import 'server-only';

import { statsRepository } from '@/data/stats';
import type { IAdminStats, IAdminStatsFilters } from '@/domain/stats';

interface IResult {
  ok: boolean;
  data?: IAdminStats;
  error?: string;
}

export const getAdminStats = async (filters: IAdminStatsFilters, userId: number): Promise<IResult> => {
  const data = await statsRepository.getAdminStats(filters, userId);
  return { ok: true, data };
};
