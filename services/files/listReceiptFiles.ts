import 'server-only';

import { fileRepository } from '@/data/files';
import { receiptRepository } from '@/data/receipts';
import { clientRepository } from '@/data/clients';
import type { IFile } from '@/domain/files';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';

interface IResult {
  ok: boolean;
  data?: IFile[];
  error?: string;
}

export const listReceiptFiles = async (receiptId: number, userId: number, role: 'ADMIN' | 'CLIENT'): Promise<IResult> => {
  const projectId = await receiptRepository.getProjectIdByReceiptId(receiptId);
  if (!projectId) return { ok: false, error: 'Чек не найден' };

  if (role === 'ADMIN') {
    const own = await ownsProject(userId, projectId);
    if (!own) return { ok: false, error: 'Чек не найден' };
    const data = await fileRepository.listByReceiptId(receiptId);
    return { ok: true, data };
  }

  const clientProjectId = await clientRepository.getClientProjectId(userId);
  if (!clientProjectId || clientProjectId !== projectId) return { ok: false, error: 'Доступ запрещён' };

  const files = await fileRepository.listByReceiptId(receiptId);
  const data = files.filter((file) => file.isVisibleToClient);
  return { ok: true, data };
};
