import 'server-only';

import { fileRepository } from '@/data/files';
import { receiptRepository } from '@/data/receipts';
import type { IFile } from '@/domain/files';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';

interface IResult {
  ok: boolean;
  data?: IFile[];
  error?: string;
}

export const listReceiptFiles = async (receiptId: number, userId: number): Promise<IResult> => {
  const projectId = await receiptRepository.getProjectIdByReceiptId(receiptId);
  if (!projectId) return { ok: false, error: 'Чек не найден' };

  const own = await ownsProject(userId, projectId);
  if (!own) return { ok: false, error: 'Чек не найден' };

  const data = await fileRepository.listByReceiptId(receiptId);
  return { ok: true, data };
};
