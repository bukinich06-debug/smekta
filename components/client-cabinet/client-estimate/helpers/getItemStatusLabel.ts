import type { EstimateItemStatus } from '@prisma/client';

export const getItemStatusLabel = (status: EstimateItemStatus): string => {
  const labels: Record<EstimateItemStatus, string> = {
    DRAFT: 'Черновик',
    AGREED: 'Согласовано',
  };
  return labels[status];
};
