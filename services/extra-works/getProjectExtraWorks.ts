import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { extraWorkRepository } from '@/data/extra-works';
import type { IProjectExtraWorks } from '@/domain/extra-works';

interface IResult {
  ok: boolean;
  data?: IProjectExtraWorks;
  error?: string;
}

export const getProjectExtraWorks = async (projectId: number, userId: number): Promise<IResult> => {
  try {
    await requireOwnProject(userId, projectId);
  } catch {
    return { ok: false, error: 'Проект не найден' };
  }

  const data = await extraWorkRepository.getByProjectId(projectId);
  return { ok: true, data };
};
