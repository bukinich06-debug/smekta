import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { fileRepository } from '@/data/files';
import { projectTzRepository } from '@/data/project-tz';
import type { IFile } from '@/domain/files';

interface IResult {
  ok: boolean;
  data?: IFile[];
  error?: string;
}

export const listProjectPhotos = async (projectId: number, userId: number): Promise<IResult> => {
  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return { ok: false, error: 'Проект не найден' };

  const own = await ownsProject(userId, projectId);
  if (!own) return { ok: false, error: 'Проект не найден' };

  const data = await fileRepository.listByProjectIdPhotos(projectId);
  return { ok: true, data };
};
