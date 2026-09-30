import type { ExtraWorkStatus } from '@prisma/client';

export interface IExtraWork {
  id: number;
  projectId: number;
  date: Date;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  amount: number;
  status: ExtraWorkStatus;
  isVisibleToClient: boolean;
  includedInBudget: boolean;
}

export interface IProjectExtraWorks {
  projectId: number;
  items: IExtraWork[];
  total: number;
  budgetTotal: number;
}

export interface IClientExtraWork {
  id: number;
  date: Date;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  amount: number;
  status: ExtraWorkStatus;
  includedInBudget: boolean;
}

export interface IClientProjectExtraWorks {
  projectId: number;
  items: IClientExtraWork[];
  total: number;
  budgetTotal: number;
}

export interface ICreateExtraWorkInput {
  projectId: number;
  date: Date;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  isVisibleToClient?: boolean;
  includedInBudget?: boolean;
}

export interface IUpdateExtraWorkInput {
  date?: Date;
  description?: string;
  unit?: string;
  quantity?: string;
  unitPrice?: string;
  isVisibleToClient?: boolean;
  includedInBudget?: boolean;
}

export interface IExtraWorkRepository {
  getByProjectId(projectId: number): Promise<IProjectExtraWorks>;
  getClientVisibleByProjectId(projectId: number): Promise<IClientProjectExtraWorks>;
  create(input: ICreateExtraWorkInput): Promise<IExtraWork>;
  update(id: number, input: IUpdateExtraWorkInput): Promise<IExtraWork>;
  delete(id: number): Promise<void>;
  toggleStatus(id: number): Promise<IExtraWork>;
  toggleVisibility(id: number): Promise<IExtraWork>;
  toggleIncludedInBudget(id: number): Promise<IExtraWork>;
}
