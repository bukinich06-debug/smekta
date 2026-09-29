export type {
  IClient,
  IProject,
  IClientWithProject,
  IClientListItem,
  ICreateClientInput,
  IClientListFilters,
  IClientCardDetails,
  IUpdateClientCardInput,
  IClientInviteInfo,
} from './types';
export { validateCreateClient, validateUpdateClientCard } from './validation';

import type {
  IClientListFilters,
  IClientListItem,
  IClientWithProject,
  ICreateClientInput,
  IClientCardDetails,
  IUpdateClientCardInput,
  IClientInviteInfo,
} from './types';

export interface IClientRepository {
  list(filters: IClientListFilters): Promise<IClientListItem[]>;
  getById(id: number): Promise<IClientWithProject | null>;
  getCardDetails(id: number): Promise<IClientCardDetails | null>;
  updateCard(clientId: number, projectId: number, input: IUpdateClientCardInput): Promise<void>;
  create(input: ICreateClientInput, managerId: number): Promise<IClientWithProject>;
  generateInviteToken(clientId: number, token: string): Promise<void>;
  getByInviteToken(token: string): Promise<IClientInviteInfo | null>;
  acceptInvite(token: string, userId: number): Promise<boolean>;
}
