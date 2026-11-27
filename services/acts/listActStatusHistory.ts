import 'server-only';

import { actRepository } from '@/data/acts';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import type { IActStatusHistoryItem } from '@/domain/acts';

interface IResult {
  ok: boolean;
  data?: IActStatusHistoryItem[];
  error?: string;
}

export const listActStatusHistory = async (actId: number, userId: number): Promise<IResult> => {
  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId || !(await ownsProject(userId, projectId)))
    return { ok: false, error: 'Акт не найден' };

  const data = await actRepository.listStatusHistory(actId);
  return { ok: true, data };
};
