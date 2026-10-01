import type { ActStatus } from '@prisma/client';

export interface IActLineItem {
  id: number;
  estimateItemId: number;
  amount: number;
  name: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  sectionName: string;
}

export interface IAct {
  id: number;
  projectId: number;
  number: string;
  date: Date;
  stage: string | null;
  status: ActStatus;
  comment: string | null;
  items: IActLineItem[];
  totalAmount: number;
}

export interface IActPickerItem {
  id: number;
  sectionId: number;
  sectionName: string;
  sortOrder: number;
  name: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  amount: number;
  assignedActId: number | null;
  assignedActNumber: string | null;
}

export interface IActPickerSection {
  id: number;
  name: string;
  sortOrder: number;
  items: IActPickerItem[];
}

export interface IProjectActs {
  projectId: number;
  acts: IAct[];
  suggestedNumber: string;
  pickerSections: IActPickerSection[];
}

export interface IClientAct {
  id: number;
  number: string;
  date: Date;
  stage: string | null;
  status: ActStatus;
  comment: string | null;
  items: IActLineItem[];
  totalAmount: number;
}

export interface IClientProjectActs {
  projectId: number;
  acts: IClientAct[];
}

export interface IActStatusHistoryItem {
  id: number;
  createdAt: Date;
  authorName: string;
  status: ActStatus;
  previousStatus: ActStatus | null;
}

export interface ICreateActInput {
  projectId: number;
  number: string;
  date: Date;
  stage?: string;
  comment?: string;
  estimateItemIds: number[];
}

export interface IUpdateActInput {
  number?: string;
  date?: Date;
  stage?: string | null;
  comment?: string | null;
  estimateItemIds?: number[];
}

export interface IActRepository {
  getByProjectId(projectId: number): Promise<IProjectActs>;
  getClientVisibleByProjectId(projectId: number): Promise<IClientProjectActs>;
  getById(id: number): Promise<IAct | null>;
  create(input: ICreateActInput): Promise<IAct>;
  update(id: number, input: IUpdateActInput): Promise<IAct>;
  delete(id: number): Promise<void>;
  updateStatus(id: number, status: ActStatus, userId: number): Promise<IAct>;
  listStatusHistory(actId: number): Promise<IActStatusHistoryItem[]>;
  getProjectIdByActId(actId: number): Promise<number | null>;
}
