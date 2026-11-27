import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { actRepository } from '@/data/acts';
import type { IProjectActs } from '@/domain/acts';

interface IResult {
  ok: boolean;
  data?: IProjectActs;
  error?: string;
}

export const getProjectActs = async (projectId: number, userId: number): Promise<IResult> => {
  try {
    await requireOwnProject(userId, projectId);
  } catch {
    return { ok: false, error: 'Проект не найден' };
  }

  const data = await actRepository.getByProjectId(projectId);
  return { ok: true, data };
};
