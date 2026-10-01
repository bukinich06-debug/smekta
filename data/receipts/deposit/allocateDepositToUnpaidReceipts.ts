import type { Prisma } from '@prisma/client';
import { getMaterialsWalletBalance } from '../helpers/materialsWalletBalance';
import { reconcileReceiptDeposit } from './reconcileReceiptDeposit';

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const parseAmount = (value: { toString(): string }): number => parseFloat(value.toString());

export const allocateDepositToUnpaidReceipts = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  userId: number
): Promise<void> => {
  let balance = await getMaterialsWalletBalance(tx, projectId);
  if (balance <= 0) return;

  const receipts = await tx.receipt.findMany({
    where: { projectId },
    orderBy: [{ date: 'asc' }, { id: 'asc' }],
    include: { payments: true },
  });

  for (const receipt of receipts) {
    const amountDue = parseAmount(receipt.amountDue);
    let paid = 0;

    for (const payment of receipt.payments) paid += parseAmount(payment.amount);

    paid = roundMoney(paid);
    const remainder = roundMoney(amountDue - paid);
    if (remainder <= 0) continue;

    balance = await getMaterialsWalletBalance(tx, projectId);
    if (balance <= 0) break;

    await reconcileReceiptDeposit({
      tx,
      receiptId: receipt.id,
      projectId,
      userId,
      receiptTitle: receipt.title,
      amountDue,
      receiptDate: receipt.date,
    });
  }
};
