import 'server-only';

import { fileRepository } from '@/data/files';
import type { IFile } from '@/domain/files';

export const listProjectActFiles = async (projectId: number): Promise<IFile[]> => {
  return await fileRepository.listByProjectIdActs(projectId);
};
