import { sumActItems } from '@/domain/acts';
import type { IComputeProjectFinanceOptions, IProjectFinanceInput, IProjectFinanceSummary } from '@/domain/finance';
import { buildFinanceLedger, computeProjectFinance } from '@/domain/finance';

export const projectFinanceQueryInclude = {
  estimateSections: {
    include: {
      items: true,
    },
  },
  receipts: {
    include: {
      payments: true,
    },
  },
  acts: {
    include: {
      items: true,
    },
  },
  extraWorks: true,
  inflows: {
    orderBy: [{ date: 'desc' as const }, { id: 'desc' as const }],
    include: {
      addedBy: { select: { name: true } },
    },
  },
  walletTransfers: {
    orderBy: [{ date: 'desc' as const }, { id: 'desc' as const }],
    include: {
      addedBy: { select: { name: true } },
    },
  },
};

type IProjectFinanceRow = {
  estimateSections: {
    items: {
      quantity: { toString(): string };
      unitPrice: { toString(): string };
      isVisibleToClient: boolean;
    }[];
  }[];
  receipts: {
    title: string;
    payments: {
      id: number;
      date: Date;
      amount: { toString(): string };
      source: 'DEPOSIT' | 'DIRECT';
    }[];
  }[];
  acts: {
    id: number;
    number: string;
    date: Date;
    status: 'DRAFT' | 'SENT' | 'SIGNED';
    items: { amount: { toString(): string } }[];
  }[];
  extraWorks: {
    id: number;
    date: Date;
    description: string;
    quantity: { toString(): string };
    unitPrice: { toString(): string };
    status: 'PENDING' | 'AGREED' | 'REJECTED';
    isVisibleToClient: boolean;
    includedInBudget: boolean;
  }[];
  inflows: {
    id: number;
    date: Date;
    amount: { toString(): string };
    purpose: 'WORKS' | 'MATERIALS';
    comment: string | null;
    addedById: number;
    addedBy: { name: string };
  }[];
  walletTransfers: {
    id: number;
    date: Date;
    amount: { toString(): string };
    fromWallet: 'WORKS' | 'MATERIALS';
    toWallet: 'WORKS' | 'MATERIALS';
    comment: string | null;
    addedById: number;
    addedBy: { name: string };
  }[];
};

export const mapProjectToFinanceInput = (project: IProjectFinanceRow): IProjectFinanceInput => {
  const payments = [];

  for (const receipt of project.receipts) {
    for (const payment of receipt.payments) {
      payments.push({
        id: payment.id,
        date: payment.date,
        amount: payment.amount.toString(),
        source: payment.source,
        receiptTitle: receipt.title,
      });
    }
  }

  return {
    estimateSections: project.estimateSections.map((section) => ({
      items: section.items.map((item) => ({
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        isVisibleToClient: item.isVisibleToClient,
      })),
    })),
    extraWorks: project.extraWorks.map((row) => ({
      id: row.id,
      date: row.date,
      description: row.description,
      quantity: row.quantity.toString(),
      unitPrice: row.unitPrice.toString(),
      status: row.status,
      isVisibleToClient: row.isVisibleToClient,
      includedInBudget: row.includedInBudget,
    })),
    acts: project.acts.map((act) => ({
      id: act.id,
      number: act.number,
      date: act.date,
      status: act.status,
      totalAmount: sumActItems(act.items.map((item) => parseFloat(item.amount.toString()))),
    })),
    payments,
    inflows: project.inflows.map((row) => ({
      id: row.id,
      date: row.date,
      amount: parseFloat(row.amount.toString()),
      purpose: row.purpose,
      comment: row.comment,
    })),
    transfers: project.walletTransfers.map((row) => ({
      id: row.id,
      date: row.date,
      amount: parseFloat(row.amount.toString()),
      fromWallet: row.fromWallet,
      toWallet: row.toWallet,
      comment: row.comment,
    })),
  };
};

export const computeSummaryFromProject = (
  project: IProjectFinanceRow,
  options: IComputeProjectFinanceOptions = {}
): IProjectFinanceSummary => {
  const input = mapProjectToFinanceInput(project);
  return computeProjectFinance(input, options);
};

export const buildFinanceViewFromProject = (
  project: IProjectFinanceRow,
  options: IComputeProjectFinanceOptions = {}
) => {
  const input = mapProjectToFinanceInput(project);
  const summary = computeProjectFinance(input, options);
  const { ledger, dueExtraWorks } = buildFinanceLedger(input, options);

  return { input, summary, ledger, dueExtraWorks, project };
};
