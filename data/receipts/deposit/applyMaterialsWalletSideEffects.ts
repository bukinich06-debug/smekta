import type { Prisma } from '@prisma/client';
import { assertMaterialsWalletNonNegative, getMaterialsWalletBalance } from '../helpers/materialsWalletBalance';
import { allocateDepositToUnpaidReceipts } from './allocateDepositToUnpaidReceipts';

export const finishMaterialsWalletMutation = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  userId: number,
  balanceBefore: number
): Promise<void> => {
  await assertMaterialsWalletNonNegative(tx, projectId);

  const balanceAfter = await getMaterialsWalletBalance(tx, projectId);
  if (balanceAfter > balanceBefore) await allocateDepositToUnpaidReceipts(tx, projectId, userId);

  await assertMaterialsWalletNonNegative(tx, projectId);
};
