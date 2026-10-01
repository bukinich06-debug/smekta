import type { ActStatus, ExtraWorkStatus, ProjectInflowPurpose, WalletType } from '@prisma/client';
import type { ActivityAction } from '@prisma/client';

export interface IFinanceEstimateItem {
  quantity: string;
  unitPrice: string;
  isVisibleToClient: boolean;
}

export interface IFinanceEstimateSection {
  items: IFinanceEstimateItem[];
}

export interface IFinanceExtraWork {
  id: number;
  date: Date;
  description: string;
  quantity: string;
  unitPrice: string;
  status: ExtraWorkStatus;
  isVisibleToClient: boolean;
  includedInBudget: boolean;
}

export interface IFinanceAct {
  id: number;
  number: string;
  date: Date;
  status: ActStatus;
  totalAmount: number;
}

export interface IFinancePayment {
  id: number;
  date: Date;
  amount: string;
  receiptTitle: string;
}

export interface IFinanceInflow {
  id: number;
  date: Date;
  amount: number;
  purpose: ProjectInflowPurpose;
  comment: string | null;
}

export interface IFinanceTransfer {
  id: number;
  date: Date;
  amount: number;
  fromWallet: WalletType;
  toWallet: WalletType;
  comment: string | null;
}

export interface IProjectFinanceInput {
  estimateSections: IFinanceEstimateSection[];
  extraWorks: IFinanceExtraWork[];
  acts: IFinanceAct[];
  payments: IFinancePayment[];
  inflows: IFinanceInflow[];
  transfers: IFinanceTransfer[];
}

export interface IBuildFinanceLedgerOptions {
  /** Маскирует названия скрытых допработ в ведомости для заказчика; суммы не меняются */
  clientLedgerView?: boolean;
}

export interface IProjectFinanceSummary {
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  stillNeededForWorks: number;
  worksWalletBalance: number;
  materialsWalletBalance: number;
}

export interface IFinanceLedgerRow {
  id: string;
  date: Date;
  label: string;
  amount: number;
  balanceAfter: number;
  kind:
    | 'inflow'
    | 'transfer_out'
    | 'transfer_in'
    | 'act'
    | 'payment'
    | 'extra_work';
}

export interface IFinanceDueExtraWork {
  id: number;
  date: Date;
  description: string;
  amount: number;
}

export interface IFinancePendingExtraWork {
  id: number;
  date: Date;
  description: string;
  amount: number;
  includedInBudget: boolean;
}

export interface IProjectInflow {
  id: number;
  projectId: number;
  date: Date;
  amount: number;
  purpose: ProjectInflowPurpose;
  comment: string | null;
  addedById: number;
  addedByName: string;
}

export interface IWalletTransfer {
  id: number;
  projectId: number;
  date: Date;
  amount: number;
  fromWallet: WalletType;
  toWallet: WalletType;
  comment: string | null;
  addedById: number;
  addedByName: string;
}

export interface IProjectFinance {
  projectId: number;
  summary: IProjectFinanceSummary;
  inflows: IProjectInflow[];
  transfers: IWalletTransfer[];
  ledger: IFinanceLedgerRow[];
  dueExtraWorks: IFinanceDueExtraWork[];
  pendingExtraWorks: IFinancePendingExtraWork[];
}

export interface IClientProjectFinance {
  projectId: number;
  summary: IProjectFinanceSummary;
  inflows: IProjectInflow[];
  transfers: IWalletTransfer[];
  ledger: IFinanceLedgerRow[];
  dueExtraWorks: IFinanceDueExtraWork[];
  pendingExtraWorks: IFinancePendingExtraWork[];
}

export interface ICreateInflowInput {
  projectId: number;
  date: Date;
  amount: number;
  purpose: ProjectInflowPurpose;
  comment?: string;
}

export interface IUpdateInflowInput {
  date?: Date;
  amount?: number;
  purpose?: ProjectInflowPurpose;
  comment?: string | null;
}

export interface ICreateTransferInput {
  projectId: number;
  date: Date;
  amount: number;
  fromWallet: WalletType;
  toWallet: WalletType;
  comment?: string;
}

export interface IUpdateTransferInput {
  date?: Date;
  amount?: number;
  fromWallet?: WalletType;
  toWallet?: WalletType;
  comment?: string | null;
}

export interface IFinanceHistoryItem {
  id: number;
  createdAt: Date;
  authorName: string;
  entityType: string;
  entityId: number;
  action: ActivityAction;
  label: string;
  detail: string;
}

export interface IFinanceRepository {
  getByProjectId(projectId: number): Promise<IProjectFinance>;
  getClientByProjectId(projectId: number): Promise<IClientProjectFinance>;
  createInflow(input: ICreateInflowInput, userId: number): Promise<IProjectInflow>;
  updateInflow(id: number, input: IUpdateInflowInput, userId: number): Promise<IProjectInflow>;
  deleteInflow(id: number, userId: number): Promise<void>;
  createTransfer(input: ICreateTransferInput, userId: number): Promise<IWalletTransfer>;
  updateTransfer(id: number, input: IUpdateTransferInput, userId: number): Promise<IWalletTransfer>;
  getTransferById(id: number): Promise<IWalletTransfer | null>;
  deleteTransfer(id: number, userId: number): Promise<void>;
  listMoneyHistory(projectId: number): Promise<IFinanceHistoryItem[]>;
  getProjectIdByInflowId(inflowId: number): Promise<number | null>;
  getProjectIdByTransferId(transferId: number): Promise<number | null>;
}
