import 'server-only';

import { clientRepository } from '@/data/clients';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { fileRepository } from '@/data/files';
import { projectTzRepository } from '@/data/project-tz';
import type { IFile } from '@/domain/files';

interface IResult {
  ok: boolean;
  data?: IFile[];
  error?: string;
}

export const listProjectPhotos = async (projectId: number, userId: number, role: 'ADMIN' | 'CLIENT'): Promise<IResult> => {
  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return { ok: false, error: 'Проект не найден' };

  if (role === 'ADMIN') {
    const own = await ownsProject(userId, projectId);
    if (!own) return { ok: false, error: 'Проект не найден' };
    const data = await fileRepository.listByProjectIdPhotos(projectId);
    return { ok: true, data };
  }

  const cabinet = await clientRepository.getCabinetByUserId(userId);
  if (!cabinet?.project || cabinet.project.id !== projectId) return { ok: false, error: 'Проект не найден' };

  const files = await fileRepository.listByProjectIdPhotos(projectId);
  const data = files.filter((file) => file.isVisibleToClient && file.album !== 'HIDDEN');
  return { ok: true, data };
};
