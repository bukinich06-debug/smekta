import { clientRepository } from '@/data/clients';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import type { IFile } from '@/domain/files';
import type { IAuthSession } from '@/domain/auth';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

export const assertTzFileReadAccess = async (session: IAuthSession, file: IFile): Promise<IAccessResult> => {
  if (file.tab !== 'TZ') return { ok: false, error: 'Файл недоступен' };

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

  return { ok: true };
};

export const assertTzAdminWriteAccess = async (
  session: IAuthSession,
  projectId: number
): Promise<IAccessResult> => {
  if (session.user.role !== 'ADMIN') return { ok: false, error: 'Недостаточно прав' };

  const own = await ownsProject(session.user.id, projectId);
  if (!own) return { ok: false, error: 'Проект не найден' };

  return { ok: true };
};
