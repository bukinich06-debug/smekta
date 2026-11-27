import 'server-only';

import { clientRepository } from '@/data/clients';
import { ownsClient } from '@/services/clients/helpers/assertProjectManager';
import type { IClientCardDetails } from '@/domain/clients';

export const getClientCard = async (id: number, userId: number): Promise<IClientCardDetails | null> => {
  const own = await ownsClient(userId, id);
  if (!own) return null;

  return await clientRepository.getCardDetails(id);
};
