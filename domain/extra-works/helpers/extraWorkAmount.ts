import type { ExtraWorkStatus } from '@prisma/client';

import { isExtraWorkAgreedForBudget } from './extraWorkStatus';

export const getExtraWorkAmount = (
  quantity: string | number | { toString(): string },
  unitPrice: string | number | { toString(): string }
): number => Number(quantity) * Number(unitPrice);

interface IBudgetRow {
  quantity: string | number | { toString(): string };
  unitPrice: string | number | { toString(): string };
  includedInBudget: boolean;
  status: ExtraWorkStatus;
  isVisibleToClient?: boolean;
}

export const sumExtraWorksInBudget = (rows: IBudgetRow[], clientVisibleOnly = false): number => {
  let sum = 0;

  for (const row of rows) {
    if (!row.includedInBudget || !isExtraWorkAgreedForBudget(row.status)) continue;
    if (clientVisibleOnly && !row.isVisibleToClient) continue;
    sum += getExtraWorkAmount(row.quantity, row.unitPrice);
  }

  return sum;
};

export const sumExtraWorkListTotal = (
  rows: { quantity: string | number | { toString(): string }; unitPrice: string | number | { toString(): string } }[]
): number => {
  let sum = 0;

  for (const row of rows) sum += getExtraWorkAmount(row.quantity, row.unitPrice);

  return sum;
};
