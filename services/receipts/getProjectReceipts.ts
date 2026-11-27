import 'server-only';

import { requireOwnProject } from '@/services/clients/helpers/assertProjectManager';
import { receiptRepository } from '@/data/receipts';
import type { IProjectReceipts } from '@/domain/receipts';

interface IResult {
  ok: boolean;
  data?: IProjectReceipts;
  error?: string;
}

export const getProjectReceipts = async (projectId: number, userId: number): Promise<IResult> => {
  await requireOwnProject(userId, projectId);

  const data = await receiptRepository.getByProjectId(projectId);
  return { ok: true, data };
};
