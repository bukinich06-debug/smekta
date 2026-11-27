import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTzHistoryItem } from '@/domain/project-tz';

interface IResult {
  ok: boolean;
  data?: IProjectTzHistoryItem[];
  error?: string;
}

export const listProjectTzHistory = async (projectId: number, userId: number): Promise<IResult> => {
  try {
    await requireOwnProject(userId, projectId);
  } catch {
    return { ok: false, error: 'Проект не найден' };
  }

  const tz = await projectTzRepository.getByProjectId(projectId);
  if (!tz) return { ok: true, data: [] };

  const data = await projectTzRepository.listHistory(projectId);
  return { ok: true, data };
};
