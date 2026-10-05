import { clientRepository } from '@/data/clients';
import { receiptRepository } from '@/data/receipts';
import type { IFile } from '@/domain/files';
import type { IAuthSession } from '@/domain/auth';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

export const assertReceiptFileReadAccess = async (
  session: IAuthSession,
  file: IFile
): Promise<IAccessResult> => {
  if (file.tab !== 'RECEIPTS') return { ok: false, error: 'Файл недоступен' };

  if (session.user.role === 'ADMIN') return { ok: true };

  if (session.user.role !== 'CLIENT') return { ok: false, error: 'Нет доступа' };

  if (!file.isVisibleToClient) return { ok: false, error: 'Файл недоступен' };

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);
  if (!cabinet?.project || cabinet.project.id !== file.projectId)
    return { ok: false, error: 'Нет доступа к проекту' };

  return { ok: true };
};

export const assertReceiptAdminWriteAccess = async (
  session: IAuthSession,
  receiptId: number
): Promise<IAccessResult & { projectId?: number }> => {
  if (session.user.role !== 'ADMIN') return { ok: false, error: 'Недостаточно прав' };

  const projectId = await receiptRepository.getProjectIdByReceiptId(receiptId);
  if (!projectId) return { ok: false, error: 'Чек не найден' };

  return { ok: true, projectId };
};
