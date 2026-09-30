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
import { getReceiptStatus, getRemainder, sumPayments } from '@/domain/receipts';

const mapPayment = (payment: {
  id: number;
  receiptId: number;
  date: Date;
  amount: { toString(): string };
  comment: string | null;
  addedById: number;
  addedBy: { name: string };
}): IReceiptPayment => ({
  id: payment.id,
  receiptId: payment.receiptId,
  date: payment.date,
  amount: payment.amount.toString(),
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
    comment: string | null;
    addedById: number;
    addedBy: { name: string };
  }[];
}): IReceipt => {
  const payments = receipt.payments.map(mapPayment);
  const paid = sumPayments(payments);
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

  async create(input: ICreateReceiptInput): Promise<IReceipt> {
    const receipt = await dbClient.receipt.create({
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

    return mapReceipt(receipt);
  },

  async update(id: number, input: IUpdateReceiptInput): Promise<IReceipt> {
    const receipt = await dbClient.receipt.update({
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

    return mapReceipt(receipt);
  },

  async delete(id: number): Promise<void> {
    await dbClient.receipt.delete({ where: { id } });
  },

  async addPayment(input: IAddPaymentInput, addedById: number): Promise<IReceiptPayment> {
    const payment = await dbClient.payment.create({
      data: {
        receiptId: input.receiptId,
        date: input.date,
        amount: input.amount,
        comment: input.comment?.trim() || null,
        addedById,
      },
      include: { addedBy: { select: { name: true } } },
    });

    return mapPayment(payment);
  },

  async deletePayment(paymentId: number): Promise<void> {
    await dbClient.payment.delete({ where: { id: paymentId } });
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
