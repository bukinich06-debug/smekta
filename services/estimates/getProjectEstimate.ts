import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { estimateRepository } from '@/data/estimates';
import type { IProjectEstimate } from '@/domain/estimates';

interface IResult {
  ok: boolean;
  data?: IProjectEstimate;
  error?: string;
}

export const getProjectEstimate = async (projectId: number, userId: number): Promise<IResult> => {
  if (!(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Проект не найден' };

  const data = await estimateRepository.getByProjectId(projectId);
  return { ok: true, data };
};
