import 'server-only';

import { actRepository } from '@/data/acts';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { fileRepository } from '@/data/files';
import type { IFile } from '@/domain/files';

interface IResult {
  ok: boolean;
  data?: IFile[];
  error?: string;
}

export const listActFiles = async (actId: number, userId: number): Promise<IResult> => {
  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId) return { ok: false, error: 'Акт не найден' };

  const own = await ownsProject(userId, projectId);
  if (!own) return { ok: false, error: 'Акт не найден' };

  const data = await fileRepository.listByActId(actId);
  return { ok: true, data };
};
