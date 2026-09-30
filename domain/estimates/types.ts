import type { EstimateItemStatus } from '@prisma/client';

export interface IEstimateSection {
  id: number;
  projectId: number;
  name: string;
  sortOrder: number;
}

export interface IEstimateItem {
  id: number;
  sectionId: number;
  sortOrder: number;
  name: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  comment: string | null;
  status: EstimateItemStatus;
  isVisibleToClient: boolean;
}

export interface IEstimateSectionWithItems extends IEstimateSection {
  items: IEstimateItem[];
  total: number;
  visibleTotal: number;
  hiddenTotal: number;
}

export interface IProjectEstimate {
  projectId: number;
  sections: IEstimateSectionWithItems[];
  total: number;
  visibleTotal: number;
  hiddenTotal: number;
}

export interface IClientEstimateItem {
  id: number;
  sectionId: number;
  sortOrder: number;
  name: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  comment: string | null;
  status: EstimateItemStatus;
}

export interface IClientEstimateSectionWithItems extends IEstimateSection {
  items: IClientEstimateItem[];
  total: number;
}

export interface IClientProjectEstimate {
  projectId: number;
  sections: IClientEstimateSectionWithItems[];
  total: number;
}

export interface ICreateSectionInput {
  projectId: number;
  name: string;
}

export interface IUpdateSectionInput {
  name: string;
}

export interface ICreateItemInput {
  sectionId: number;
  name: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  comment?: string;
  status?: EstimateItemStatus;
  isVisibleToClient?: boolean;
}

export interface IUpdateItemInput {
  name?: string;
  unit?: string;
  quantity?: string;
  unitPrice?: string;
  comment?: string;
  status?: EstimateItemStatus;
  isVisibleToClient?: boolean;
}

export interface IEstimateRepository {
  getByProjectId(projectId: number): Promise<IProjectEstimate>;
  getClientVisibleByProjectId(projectId: number): Promise<IClientProjectEstimate>;
  createSection(input: ICreateSectionInput): Promise<IEstimateSection>;
  updateSection(id: number, input: IUpdateSectionInput): Promise<IEstimateSection>;
  deleteSection(id: number): Promise<void>;
  createItem(input: ICreateItemInput): Promise<IEstimateItem>;
  updateItem(id: number, input: IUpdateItemInput): Promise<IEstimateItem>;
  deleteItem(id: number): Promise<void>;
}
