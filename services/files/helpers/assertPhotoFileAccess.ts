import { clientRepository } from '@/data/clients';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import type { IFile } from '@/domain/files';

interface IAccessResult {
  ok: boolean;
  error?: string;
}

export const assertPhotoFileReadAccess = async (userId: number, role: 'ADMIN' | 'CLIENT', file: IFile): Promise<IAccessResult> => {
  if (file.tab !== 'PHOTOS') return { ok: false, error: 'Файл недоступен' };

  if (role === 'ADMIN') {
    const own = await ownsProject(userId, file.projectId);
    if (!own) return { ok: false, error: 'Файл недоступен' };
    return { ok: true };
  }

  if (role !== 'CLIENT') return { ok: false, error: 'Нет доступа' };

  if (!file.isVisibleToClient || file.album === 'HIDDEN') return { ok: false, error: 'Файл недоступен' };

  const cabinet = await clientRepository.getCabinetByUserId(userId);
  if (!cabinet?.project || cabinet.project.id !== file.projectId)
    return { ok: false, error: 'Нет доступа к проекту' };

  return { ok: true };
};

export const assertPhotoAdminWriteAccess = async (
  userId: number,
  projectId: number
): Promise<IAccessResult> => {
  const own = await ownsProject(userId, projectId);
  if (!own) return { ok: false, error: 'Проект не найден' };

  return { ok: true };
};
