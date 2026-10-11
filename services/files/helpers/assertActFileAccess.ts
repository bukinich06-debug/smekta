import { actRepository } from '@/data/acts';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { clientRepository } from '@/data/clients';
import type { IFile } from '@/domain/files';
import type { IAuthSession } from '@/domain/auth';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

const CLIENT_VISIBLE_STATUSES = new Set(['SENT', 'SIGNED']);

export const assertActFileReadAccess = async (session: IAuthSession, file: IFile): Promise<IAccessResult> => {
  if (file.tab !== 'ACTS' || file.actId === null) return { ok: false, error: 'Файл недоступен' };

  if (session.user.role === 'ADMIN') {
    const own = await ownsProject(session.user.id, file.projectId);
    if (!own) return { ok: false, error: 'Файл недоступен' };
    return { ok: true };
  }

  if (session.user.role !== 'CLIENT') return { ok: false, error: 'Нет доступа' };

  if (!file.isVisibleToClient) return { ok: false, error: 'Файл недоступен' };

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);
  if (!cabinet?.project || cabinet.project.id !== file.projectId)
    return { ok: false, error: 'Нет доступа к проекту' };

  const act = await actRepository.getById(file.actId);
  if (!act || !CLIENT_VISIBLE_STATUSES.has(act.status)) return { ok: false, error: 'Акт недоступен' };

  return { ok: true };
};

export const assertActAdminWriteAccess = async (
  session: IAuthSession,
  actId: number
): Promise<IAccessResult & { projectId?: number }> => {
  if (session.user.role !== 'ADMIN') return { ok: false, error: 'Недостаточно прав' };

  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId) return { ok: false, error: 'Акт не найден' };

  const own = await ownsProject(session.user.id, projectId);
  if (!own) return { ok: false, error: 'Акт не найден' };

  return { ok: true, projectId };
};
