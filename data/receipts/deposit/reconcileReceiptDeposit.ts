import { ActivityAction } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { assertMaterialsWalletNonNegative, getMaterialsWalletBalance } from '../helpers/materialsWalletBalance';
import { logDepositOffset } from './logDepositOffset';

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const parseAmount = (value: { toString(): string }): number => parseFloat(value.toString());

interface IReconcileReceiptDepositParams {
  tx: Prisma.TransactionClient;
  receiptId: number;
  projectId: number;
  userId: number;
  receiptTitle: string;
  amountDue: number;
  receiptDate: Date;
}

export const reconcileReceiptDeposit = async ({
  tx,
  receiptId,
  projectId,
  userId,
  receiptTitle,
  amountDue,
  receiptDate,
}: IReconcileReceiptDepositParams): Promise<void> => {
  const payments = await tx.payment.findMany({
    where: { receiptId },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });

  let directPaid = 0;
  let depositPaid = 0;
  const depositPayments = [];

  for (const payment of payments) {
    const amount = parseAmount(payment.amount);
    if (payment.source === 'DIRECT') directPaid += amount;
    else {
      depositPaid += amount;
      depositPayments.push(payment);
    }
  }

  directPaid = roundMoney(directPaid);
  depositPaid = roundMoney(depositPaid);

  const needFromDeposit = roundMoney(Math.max(0, amountDue - directPaid));
  const walletBalance = await getMaterialsWalletBalance(tx, projectId);
  const availableForReceipt = roundMoney(walletBalance + depositPaid);
  const targetDeposit = roundMoney(Math.min(needFromDeposit, availableForReceipt));

  if (targetDeposit === depositPaid) return;

  if (targetDeposit < depositPaid) {
    let toRemove = roundMoney(depositPaid - targetDeposit);

    for (const payment of depositPayments) {
      if (toRemove <= 0) break;

      const before = depositPaid;
      const paymentAmount = parseAmount(payment.amount);

      if (paymentAmount <= toRemove) {
        await tx.payment.delete({ where: { id: payment.id } });
        depositPaid = roundMoney(depositPaid - paymentAmount);
        toRemove = roundMoney(toRemove - paymentAmount);

        await logDepositOffset({
          tx,
          userId,
          projectId,
          receiptId,
          action: ActivityAction.DELETE,
          depositBefore: before,
          depositAfter: depositPaid,
          amountDelta: -paymentAmount,
          receiptTitle,
        });
      } else {
        const newAmount = roundMoney(paymentAmount - toRemove);
        await tx.payment.update({
          where: { id: payment.id },
          data: { amount: newAmount },
        });
        depositPaid = targetDeposit;

        await logDepositOffset({
          tx,
          userId,
          projectId,
          receiptId,
          action: ActivityAction.UPDATE,
          depositBefore: before,
          depositAfter: depositPaid,
          amountDelta: -toRemove,
          receiptTitle,
        });
        toRemove = 0;
      }
    }

    return;
  }

  const toAdd = roundMoney(targetDeposit - depositPaid);
  if (toAdd <= 0) return;

  const before = depositPaid;

  await tx.payment.create({
    data: {
      receiptId,
      date: receiptDate,
      amount: toAdd,
      source: 'DEPOSIT',
      comment: 'Автозачёт из депозита на материалы',
      addedById: userId,
    },
  });

  await logDepositOffset({
    tx,
    userId,
    projectId,
    receiptId,
    action: ActivityAction.CREATE,
    depositBefore: before,
    depositAfter: targetDeposit,
    amountDelta: toAdd,
    receiptTitle,
  });

  await assertMaterialsWalletNonNegative(tx, projectId);
};
