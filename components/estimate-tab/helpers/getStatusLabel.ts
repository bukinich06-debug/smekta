import type { EstimateItemStatus } from '@prisma/client';

export const getStatusLabel = (status: EstimateItemStatus): string => {
  const labels: Record<EstimateItemStatus, string> = {
    DRAFT: 'Черновик',
    AGREED: 'Согласовано',
  };
  return labels[status];
};
