import 'server-only';

import { fileRepository } from '@/data/files';
import type { IFile } from '@/domain/files';

export const listClientProjectReceiptFiles = async (projectId: number): Promise<IFile[]> => {
  const all = await fileRepository.listByProjectIdReceipts(projectId);
  return all.filter((file) => file.isVisibleToClient);
};
