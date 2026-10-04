import type { ExtraWorkStatus } from '@prisma/client';

export const isExtraWorkAgreedForBudget = (status: ExtraWorkStatus): boolean =>
  status === 'AGREED' || status === 'DONE';

export const isExtraWorkDone = (status: ExtraWorkStatus): boolean => status === 'DONE';
