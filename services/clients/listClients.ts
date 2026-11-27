import 'server-only';

import { clientRepository } from '@/data/clients';
import type { IClientListItem, IClientListFilters } from '@/domain/clients';

export const listClients = async (filters: IClientListFilters, userId: number): Promise<IClientListItem[]> => {
  return await clientRepository.list(filters, userId);
};
