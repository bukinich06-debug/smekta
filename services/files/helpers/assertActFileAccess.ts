import { actRepository } from '@/data/acts';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { clientRepository } from '@/data/clients';
import type { IFile } from '@/domain/files';
import { CLIENT_VISIBLE_ACT_STATUSES } from './constants';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

export const assertActFileReadAccess = async (userId: number, role: 'ADMIN' | 'CLIENT', file: IFile): Promise<IAccessResult> => {
  if (file.tab !== 'ACTS' || file.actId === null) return { ok: false, error: 'Файл недоступен' };

  if (role === 'ADMIN') {
    const own = await ownsProject(userId, file.projectId);
    if (!own) return { ok: false, error: 'Файл недоступен' };
    return { ok: true };
  }

  if (role !== 'CLIENT') return { ok: false, error: 'Нет доступа' };

  if (!file.isVisibleToClient) return { ok: false, error: 'Файл недоступен' };

  const clientProjectId = await clientRepository.getClientProjectId(userId);
  if (!clientProjectId || clientProjectId !== file.projectId)
    return { ok: false, error: 'Нет доступа к проекту' };

  const act = await actRepository.getById(file.actId);
  if (!act || !CLIENT_VISIBLE_ACT_STATUSES.has(act.status)) return { ok: false, error: 'Акт недоступен' };

  return { ok: true };
};

export const assertActAdminWriteAccess = async (
  userId: number,
  actId: number
): Promise<IAccessResult & { projectId?: number }> => {
  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId) return { ok: false, error: 'Акт не найден' };

  const own = await ownsProject(userId, projectId);
  if (!own) return { ok: false, error: 'Акт не найден' };

  return { ok: true, projectId };
};
