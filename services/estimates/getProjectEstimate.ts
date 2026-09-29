'use server';

import { estimateRepository } from '@/data/estimates';
import type { IProjectEstimate } from '@/domain/estimates';

export const getProjectEstimate = async (projectId: number): Promise<IProjectEstimate> => {
  return await estimateRepository.getByProjectId(projectId);
};
