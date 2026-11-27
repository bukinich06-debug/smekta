import 'server-only';

import { clientRepository } from '@/data/clients';
import type { IClientCardDetails } from '@/domain/clients';

export const getClientCabinet = async (userId: number): Promise<IClientCardDetails | null> => {
  return await clientRepository.getCabinetByUserId(userId);
};
