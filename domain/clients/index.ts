export type {
  IClient,
  IProject,
  IClientWithProject,
  IClientListItem,
  ICreateClientInput,
  IClientListFilters,
} from './types';
export { validateCreateClient } from './validation';

import type {
  IClientListFilters,
  IClientListItem,
  IClientWithProject,
  ICreateClientInput,
} from './types';

export interface IClientRepository {
  list(filters: IClientListFilters): Promise<IClientListItem[]>;
  getById(id: number): Promise<IClientWithProject | null>;
  create(input: ICreateClientInput, managerId: number): Promise<IClientWithProject>;
}
