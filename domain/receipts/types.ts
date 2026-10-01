export type ReceiptStatus = 'pending' | 'underpaid' | 'paid';

export type ReceiptStatusFilter = 'all' | ReceiptStatus;

export type PaymentSource = 'DEPOSIT' | 'DIRECT';

export interface IReceiptSectionOption {
  id: number;
  name: string;
}

export interface IReceiptPayment {
  id: number;
  receiptId: number;
  date: Date;
  amount: string;
  source: PaymentSource;
  comment: string | null;
  addedById: number;
  addedByName: string;
}

export interface IReceipt {
  id: number;
  projectId: number;
  estimateSectionId: number | null;
  estimateSectionName: string | null;
  date: Date;
  title: string;
  amountDue: string;
  comment: string | null;
  payments: IReceiptPayment[];
  paid: number;
  paidFromDeposit: number;
  paidDirect: number;
  remainder: number;
  status: ReceiptStatus;
}

export interface IProjectReceipts {
  projectId: number;
  receipts: IReceipt[];
  sections: IReceiptSectionOption[];
  totalDue: number;
  totalPaid: number;
  totalRemainder: number;
}

export interface ICreateReceiptInput {
  projectId: number;
  date: Date;
  title: string;
  amountDue: string;
  comment?: string;
  estimateSectionId?: number | null;
}

export interface IUpdateReceiptInput {
  date?: Date;
  title?: string;
  amountDue?: string;
  comment?: string | null;
  estimateSectionId?: number | null;
}

export interface IAddPaymentInput {
  receiptId: number;
  date: Date;
  amount: string;
  comment?: string;
}

export interface IReceiptRepository {
  getByProjectId(projectId: number): Promise<IProjectReceipts>;
  getById(id: number): Promise<IReceipt | null>;
  create(input: ICreateReceiptInput, userId: number): Promise<IReceipt>;
  update(id: number, input: IUpdateReceiptInput, userId: number): Promise<IReceipt>;
  delete(id: number, userId: number): Promise<void>;
  addPayment(input: IAddPaymentInput, addedById: number): Promise<IReceiptPayment>;
  deletePayment(paymentId: number): Promise<void>;
  allocateDepositToUnpaidReceipts(projectId: number, userId: number): Promise<void>;
  getProjectIdByReceiptId(receiptId: number): Promise<number | null>;
  getProjectIdByPaymentId(paymentId: number): Promise<number | null>;
}
