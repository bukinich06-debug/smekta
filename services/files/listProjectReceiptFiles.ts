import 'server-only';

import { fileRepository } from '@/data/files';
import type { IFile } from '@/domain/files';

export const listProjectReceiptFiles = async (projectId: number): Promise<IFile[]> => {
  return await fileRepository.listByProjectIdReceipts(projectId);
};
