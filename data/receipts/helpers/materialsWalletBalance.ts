import type { Prisma } from '@prisma/client';
import { MaterialsDepositInsufficientError } from './materialsDepositError';

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

export const getTotalDepositAllocated = async (
  tx: Prisma.TransactionClient,
  projectId: number
): Promise<number> => {
  const depositPayments = await tx.payment.aggregate({
    where: {
      source: 'DEPOSIT',
      receipt: { projectId },
    },
    _sum: { amount: true },
  });

  if (!depositPayments._sum.amount) return 0;

  return roundMoney(parseFloat(depositPayments._sum.amount.toString()));
};

export const assertMaterialsWalletNonNegative = async (
  tx: Prisma.TransactionClient,
  projectId: number
): Promise<void> => {
  const balance = await getMaterialsWalletBalance(tx, projectId);
  if (balance >= 0) return;

  const allocated = await getTotalDepositAllocated(tx, projectId);
  throw new MaterialsDepositInsufficientError(allocated);
};

export const getMaterialsWalletBalance = async (
  tx: Prisma.TransactionClient,
  projectId: number
): Promise<number> => {
  const [inflows, transfers, depositPayments] = await Promise.all([
    tx.projectInflow.aggregate({
      where: { projectId, purpose: 'MATERIALS' },
      _sum: { amount: true },
    }),
    tx.walletTransfer.findMany({
      where: { projectId },
      select: { amount: true, fromWallet: true, toWallet: true },
    }),
    tx.payment.aggregate({
      where: {
        source: 'DEPOSIT',
        receipt: { projectId },
      },
      _sum: { amount: true },
    }),
  ]);

  let balance = inflows._sum.amount ? parseFloat(inflows._sum.amount.toString()) : 0;

  for (const transfer of transfers) {
    const amount = parseFloat(transfer.amount.toString());
    if (transfer.fromWallet === 'MATERIALS') balance -= amount;
    if (transfer.toWallet === 'MATERIALS') balance += amount;
  }

  if (depositPayments._sum.amount) balance -= parseFloat(depositPayments._sum.amount.toString());

  return roundMoney(balance);
};
