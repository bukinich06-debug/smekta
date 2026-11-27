import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTz } from '@/domain/project-tz';

interface IResult {
  ok: boolean;
  data?: IProjectTz | null;
  error?: string;
}

export const getProjectTz = async (projectId: number, userId: number): Promise<IResult> => {
  try {
    await requireOwnProject(userId, projectId);
  } catch {
    return { ok: false, error: 'Проект не найден' };
  }

  const data = await projectTzRepository.getByProjectId(projectId);
  return { ok: true, data };
};
