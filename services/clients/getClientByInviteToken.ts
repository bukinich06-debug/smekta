'use server';

import { clientRepository } from '@/data/clients';
import type { IClientInviteInfo } from '@/domain/clients';

export const getClientByInviteToken = async (token: string): Promise<IClientInviteInfo | null> => {
  return clientRepository.getByInviteToken(token);
};
