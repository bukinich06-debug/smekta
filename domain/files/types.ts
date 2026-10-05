export type FileTab = 'TZ' | 'ESTIMATE' | 'RECEIPTS' | 'ACTS' | 'EXTRA_WORKS' | 'PHOTOS';

export interface IFile {
  id: number;
  projectId: number;
  tab: FileTab;
  receiptId: number | null;
  paymentId: number | null;
  actId: number | null;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedById: number;
  uploadedByName: string;
  uploadedAt: Date;
  isPhoto: boolean;
  isVisibleToClient: boolean;
}

export interface ICreateReceiptFileInput {
  projectId: number;
  receiptId: number;
  paymentId?: number | null;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedById: number;
  isPhoto: boolean;
}

export interface ICreateActFileInput {
  projectId: number;
  actId: number;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedById: number;
  isPhoto: boolean;
}

export interface ICreateTzFileInput {
  projectId: number;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedById: number;
  isPhoto: boolean;
}

export interface IFileRepository {
  getById(id: number): Promise<IFile | null>;
  listByReceiptId(receiptId: number): Promise<IFile[]>;
  listByActId(actId: number): Promise<IFile[]>;
  listByProjectIdTz(projectId: number): Promise<IFile[]>;
  create(input: ICreateReceiptFileInput): Promise<IFile>;
  createActFile(input: ICreateActFileInput): Promise<IFile>;
  createTzFile(input: ICreateTzFileInput): Promise<IFile>;
  delete(id: number): Promise<void>;
}
