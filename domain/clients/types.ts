import type { ProjectStatus } from '@prisma/client';

export interface IClient {
  id: number;
  fullName: string;
  phone: string | null;
  email: string | null;
  userId: number | null;
  inviteToken: string | null;
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
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
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
  sortBy?:
    | 'fullName'
    | 'address'
    | 'estimateTotal'
    | 'receivedTotal'
    | 'masteredTotal'
    | 'balanceOnHand'
    | 'dueNow'
    | 'startDate'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IClientCardDetails extends IClient {
  project: IProject | null;
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  stillNeededForWorks: number;
  userEmail: string | null;
}

export interface IClientInviteInfo {
  id: number;
  fullName: string;
  projectNumber: string | null;
  projectName: string | null;
  projectAddress: string | null;
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
