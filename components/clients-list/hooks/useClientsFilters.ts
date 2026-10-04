'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import type { ProjectStatus } from '@prisma/client';
import type { IClientListFilters } from '@/domain/clients';

export const useClientsFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: IClientListFilters = {
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as ProjectStatus) || undefined,
    sortBy: (searchParams.get('sortBy') as IClientListFilters['sortBy']) || 'updatedAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  };

  const updateFilters = (updates: Partial<IClientListFilters>) => {
    const params = new URLSearchParams(searchParams.toString());

    if ('search' in updates) {
      if (updates.search) params.set('search', updates.search);
      else params.delete('search');
    }

    if ('status' in updates) {
      if (updates.status) params.set('status', updates.status);
      else params.delete('status');
    }

    if (updates.sortBy) params.set('sortBy', updates.sortBy);
    if (updates.sortOrder) params.set('sortOrder', updates.sortOrder);

    router.push(`?${params.toString()}`);
  };

  return { filters, updateFilters };
};
