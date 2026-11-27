import 'server-only';

import { clientRepository } from '@/data/clients';
import { estimateRepository } from '@/data/estimates';
import type { IClientProjectEstimate } from '@/domain/estimates';

export const getClientProjectEstimate = async (
  userId: number
): Promise<IClientProjectEstimate | null> => {
  const cabinet = await clientRepository.getCabinetByUserId(userId);

  if (!cabinet?.project) return null;

  return await estimateRepository.getClientVisibleByProjectId(cabinet.project.id);
};
