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

export const listTzFiles = async (projectId: number, userId: number, role: 'ADMIN' | 'CLIENT'): Promise<IResult> => {
  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return { ok: true, data: [] };

  if (role === 'ADMIN') {
    const own = await ownsProject(userId, projectId);
    if (!own) return { ok: false, error: 'Проект не найден' };
    const data = await fileRepository.listByProjectIdTz(projectId);
    return { ok: true, data };
  }

  if (role !== 'CLIENT') return { ok: false, error: 'Нет доступа' };

  const cabinet = await clientRepository.getCabinetByUserId(userId);
  if (!cabinet?.project || cabinet.project.id !== projectId) 
    return { ok: false, error: 'Проект не найден' };

  const files = await fileRepository.listByProjectIdTz(projectId);
  const data = files.filter((file) => file.isVisibleToClient);
  return { ok: true, data };
};
