'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ProjectStatus } from '@prisma/client';

export interface IStatsFiltersState {
  status?: ProjectStatus;
  dateFrom?: string;
  dateTo?: string;
}

export const useStatsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: IStatsFiltersState = {
    status: (searchParams.get('status') as ProjectStatus) || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
  };

  const updateFilters = (updates: Partial<IStatsFiltersState>) => {
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value?: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    if (updates.status !== undefined) setOrDelete('status', updates.status);
    if (updates.dateFrom !== undefined) setOrDelete('dateFrom', updates.dateFrom);
    if (updates.dateTo !== undefined) setOrDelete('dateTo', updates.dateTo);

    router.push(`?${params.toString()}`);
  };

  return { filters, updateFilters };
};
