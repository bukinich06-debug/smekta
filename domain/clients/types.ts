import type { ProjectStatus } from '@prisma/client';

export interface IClient {
  id: number;
  fullName: string;
  phone: string | null;
  email: string | null;
  userId: number | null;
}

export interface IProject {
  id: number;
  clientId: number;
  number: string;
  name: string;
  address: string;
  status: ProjectStatus;
  startDate: Date | null;
  managerId: number;
  updatedAt: Date;
}

export interface IClientWithProject extends IClient {
  project: IProject | null;
}

export interface IClientListItem {
  id: number;
  fullName: string;
  address: string;
  projectStatus: ProjectStatus | null;
  estimateTotal: number;
  paid: number;
  debt: number;
  startDate: Date | null;
  updatedAt: Date | null;
}

export interface ICreateClientInput {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  projectName: string;
  projectStatus: ProjectStatus;
  startDate: Date | null;
}

export interface IClientListFilters {
  search?: string;
  status?: ProjectStatus;
  sortBy?: 'fullName' | 'address' | 'estimateTotal' | 'paid' | 'debt' | 'startDate' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IClientCardDetails extends IClient {
  project: IProject | null;
  estimateTotal: number;
  paid: number;
  debt: number;
}

export interface IUpdateClientCardInput {
  fullName: string;
  phone: string;
  email: string;
  projectName: string;
  address: string;
  projectStatus: ProjectStatus;
  startDate: Date | null;
  managerId: number;
}
