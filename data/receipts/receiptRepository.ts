import { ActivityAction } from '@prisma/client';
import { dbClient } from '@/data/shared/dbClient';
import type {
  IReceiptRepository,
  IReceipt,
  IProjectReceipts,
  ICreateReceiptInput,
  IUpdateReceiptInput,
  IAddPaymentInput,
  IReceiptPayment,
} from '@/domain/receipts';
import { getReceiptStatus, getRemainder, sumPayments, sumPaymentsBySource } from '@/domain/receipts';
import type { Prisma } from '@prisma/client';
import { finishMaterialsWalletMutation } from './deposit/applyMaterialsWalletSideEffects';
import { reconcileReceiptDeposit } from './deposit/reconcileReceiptDeposit';
import { logDepositOffset } from './deposit/logDepositOffset';
import { getMaterialsWalletBalance } from './helpers/materialsWalletBalance';
import { lockProjectFinance } from '@/data/shared/projectFinanceLock';
import { purgeBlobFilesForPayment, purgeBlobFilesForReceipt } from '@/data/files/helpers/purgeBlobFiles';

const mapPayment = (payment: {
  id: number;
  receiptId: number;
  date: Date;
  amount: { toString(): string };
  source: 'DEPOSIT' | 'DIRECT';
  comment: string | null;
  addedById: number;
  addedBy: { name: string };
}): IReceiptPayment => ({
  id: payment.id,
  receiptId: payment.receiptId,
  date: payment.date,
  amount: payment.amount.toString(),
  source: payment.source,
  comment: payment.comment,
  addedById: payment.addedById,
  addedByName: payment.addedBy.name,
});

const mapReceipt = (receipt: {
  id: number;
  projectId: number;
  estimateSectionId: number | null;
  estimateSection: { name: string } | null;
  date: Date;
  title: string;
  amountDue: { toString(): string };
  comment: string | null;
  payments: {
    id: number;
    receiptId: number;
    date: Date;
    amount: { toString(): string };
    source: 'DEPOSIT' | 'DIRECT';
    comment: string | null;
    addedById: number;
    addedBy: { name: string };
  }[];
}): IReceipt => {
  const payments = receipt.payments.map(mapPayment);
  const paid = sumPayments(payments);
  const paidFromDeposit = sumPaymentsBySource(payments, 'DEPOSIT');
  const paidDirect = sumPaymentsBySource(payments, 'DIRECT');
  const amountDue = receipt.amountDue.toString();

  return {
    id: receipt.id,
    projectId: receipt.projectId,
    estimateSectionId: receipt.estimateSectionId,
    estimateSectionName: receipt.estimateSection?.name ?? null,
    date: receipt.date,
    title: receipt.title,
    amountDue,
    comment: receipt.comment,
    payments,
    paid,
    paidFromDeposit,
    paidDirect,
    remainder: getRemainder(amountDue, paid),
    status: getReceiptStatus(amountDue, paid),
  };
};

const receiptInclude = {
  estimateSection: { select: { name: true } },
  payments: {
    orderBy: { date: 'desc' as const },
    include: { addedBy: { select: { name: true } } },
  },
};

const buildProjectReceipts = async (projectId: number): Promise<IProjectReceipts> => {
  const [receipts, sections] = await Promise.all([
    dbClient.receipt.findMany({
      where: { projectId },
      orderBy: { date: 'desc' },
      include: receiptInclude,
    }),
    dbClient.estimateSection.findMany({
      where: { projectId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  const mapped = receipts.map(mapReceipt);
  let totalDue = 0;
  let totalPaid = 0;

  for (const receipt of mapped) {
    totalDue += parseFloat(receipt.amountDue);
    totalPaid += receipt.paid;
  }

  return {
    projectId,
    receipts: mapped,
    sections,
    totalDue: Math.round(totalDue * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalRemainder: Math.round((totalDue - totalPaid) * 100) / 100,
  };
};

const logDepositPaymentsRemoved = async (
  tx: Prisma.TransactionClient,
  params: {
    userId: number;
    projectId: number;
    receiptId: number;
    receiptTitle: string;
    payments: { amount: { toString(): string } }[];
  }
): Promise<void> => {
  let depositOnReceipt = 0;

  for (const payment of params.payments) {
    depositOnReceipt += parseFloat(payment.amount.toString());
  }

  if (depositOnReceipt <= 0) return;

  await logDepositOffset({
    tx,
    userId: params.userId,
    projectId: params.projectId,
    receiptId: params.receiptId,
    action: ActivityAction.DELETE,
    depositBefore: depositOnReceipt,
    depositAfter: 0,
    amountDelta: -depositOnReceipt,
    receiptTitle: params.receiptTitle,
  });
};

export const receiptRepository: IReceiptRepository = {
  async getByProjectId(projectId: number): Promise<IProjectReceipts> {
    return await buildProjectReceipts(projectId);
  },

  async getById(id: number): Promise<IReceipt | null> {
    const receipt = await dbClient.receipt.findUnique({
      where: { id },
      include: receiptInclude,
    });

    if (!receipt) return null;

    return mapReceipt(receipt);
  },

  async create(input: ICreateReceiptInput, userId: number): Promise<IReceipt> {
    const receipt = await dbClient.$transaction(async (tx) => {
      await lockProjectFinance(tx, input.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, input.projectId);

      const created = await tx.receipt.create({
        data: {
          projectId: input.projectId,
          date: input.date,
          title: input.title.trim(),
          amountDue: input.amountDue,
          comment: input.comment?.trim() || null,
          estimateSectionId: input.estimateSectionId ?? null,
        },
        include: receiptInclude,
      });

      const amountDue = parseFloat(created.amountDue.toString());

      await reconcileReceiptDeposit({
        tx,
        receiptId: created.id,
        projectId: input.projectId,
        userId,
        receiptTitle: created.title,
        amountDue,
        receiptDate: created.date,
      });

      await finishMaterialsWalletMutation(tx, input.projectId, userId, balanceBefore);

      const withPayments = await tx.receipt.findUnique({
        where: { id: created.id },
        include: receiptInclude,
      });

      if (!withPayments) throw new Error('RECEIPT_NOT_FOUND');

      return withPayments;
    });

    return mapReceipt(receipt);
  },

  async update(id: number, input: IUpdateReceiptInput, userId: number): Promise<IReceipt> {
    const receipt = await dbClient.$transaction(async (tx) => {
      const current = await tx.receipt.findUnique({
        where: { id },
        include: { payments: true },
      });

      if (!current) throw new Error('RECEIPT_NOT_FOUND');

      await lockProjectFinance(tx, current.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, current.projectId);

      const updated = await tx.receipt.update({
        where: { id },
        data: {
          date: input.date,
          title: input.title?.trim(),
          amountDue: input.amountDue,
          comment: input.comment === undefined ? undefined : input.comment?.trim() || null,
          estimateSectionId: input.estimateSectionId === undefined ? undefined : input.estimateSectionId,
        },
        include: receiptInclude,
      });

      const amountDue = parseFloat(updated.amountDue.toString());

      let directPaid = 0;

      for (const payment of updated.payments) {
        if (payment.source !== 'DIRECT') continue;
        directPaid += parseFloat(payment.amount.toString());
      }

      if (directPaid > amountDue) throw new Error('AMOUNT_LESS_THAN_DIRECT_PAID');

      await reconcileReceiptDeposit({
        tx,
        receiptId: id,
        projectId: current.projectId,
        userId,
        receiptTitle: updated.title,
        amountDue,
        receiptDate: updated.date,
      });

      await finishMaterialsWalletMutation(tx, current.projectId, userId, balanceBefore);

      const withPayments = await tx.receipt.findUnique({
        where: { id },
        include: receiptInclude,
      });

      if (!withPayments) throw new Error('RECEIPT_NOT_FOUND');

      return withPayments;
    });

    return mapReceipt(receipt);
  },

  async delete(id: number, userId: number): Promise<void> {
    await purgeBlobFilesForReceipt(id);

    await dbClient.$transaction(async (tx) => {
      const current = await tx.receipt.findUnique({
        where: { id },
        include: { payments: { where: { source: 'DEPOSIT' } } },
      });

      if (!current) throw new Error('RECEIPT_NOT_FOUND');

      await lockProjectFinance(tx, current.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, current.projectId);

      await logDepositPaymentsRemoved(tx, {
        userId,
        projectId: current.projectId,
        receiptId: id,
        receiptTitle: current.title,
        payments: current.payments,
      });

      await tx.receipt.delete({ where: { id } });

      await finishMaterialsWalletMutation(tx, current.projectId, userId, balanceBefore);
    });
  },

  async addPayment(input: IAddPaymentInput, addedById: number): Promise<IReceiptPayment> {
    const payment = await dbClient.$transaction(async (tx) => {
      const receipt = await tx.receipt.findUnique({
        where: { id: input.receiptId },
        select: { projectId: true },
      });

      if (!receipt) throw new Error('RECEIPT_NOT_FOUND');

      await lockProjectFinance(tx, receipt.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, receipt.projectId);

      const receiptState = await tx.receipt.findUnique({
        where: { id: input.receiptId },
        include: { payments: true },
      });

      if (!receiptState) throw new Error('RECEIPT_NOT_FOUND');

      const paid = sumPayments(
        receiptState.payments.map((row) => ({
          amount: row.amount.toString(),
        }))
      );
      const remainder = getRemainder(receiptState.amountDue.toString(), paid);
      const payAmount = parseFloat(input.amount);

      if (payAmount > remainder) throw new Error('PAYMENT_EXCEEDS_REMAINDER');

      const created = await tx.payment.create({
        data: {
          receiptId: input.receiptId,
          date: input.date,
          amount: input.amount,
          source: 'DIRECT',
          comment: input.comment?.trim() || null,
          addedById,
        },
        include: { addedBy: { select: { name: true } } },
      });

      await finishMaterialsWalletMutation(tx, receipt.projectId, addedById, balanceBefore);

      return created;
    });

    return mapPayment(payment);
  },

  async deletePayment(paymentId: number, userId: number): Promise<void> {
    await purgeBlobFilesForPayment(paymentId);

    await dbClient.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        select: { source: true, receipt: { select: { projectId: true } } },
      });

      if (!payment) throw new Error('PAYMENT_NOT_FOUND');
      if (payment.source === 'DEPOSIT') throw new Error('DEPOSIT_PAYMENT_READONLY');

      await lockProjectFinance(tx, payment.receipt.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, payment.receipt.projectId);

      await tx.payment.delete({ where: { id: paymentId } });

      await finishMaterialsWalletMutation(tx, payment.receipt.projectId, userId, balanceBefore);
    });
  },

  async getProjectIdByReceiptId(receiptId: number): Promise<number | null> {
    const receipt = await dbClient.receipt.findUnique({
      where: { id: receiptId },
      select: { projectId: true },
    });
    return receipt?.projectId ?? null;
  },

  async getProjectIdByPaymentId(paymentId: number): Promise<number | null> {
    const payment = await dbClient.payment.findUnique({
      where: { id: paymentId },
      select: { receipt: { select: { projectId: true } } },
    });
    return payment?.receipt.projectId ?? null;
  },
};
