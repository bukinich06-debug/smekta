import 'server-only';

import { actRepository } from '@/data/acts';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { clientRepository } from '@/data/clients';
import { fileRepository } from '@/data/files';
import type { IFile } from '@/domain/files';
import { CLIENT_VISIBLE_ACT_STATUSES } from './helpers/constants';

interface IResult {
  ok: boolean;
  data?: IFile[];
  error?: string;
}

export const listActFiles = async (actId: number, userId: number, role: 'ADMIN' | 'CLIENT'): Promise<IResult> => {
  const projectId = await actRepository.getProjectIdByActId(actId);
  if (!projectId) return { ok: false, error: 'Акт не найден' };

  if (role === 'ADMIN') {
    const own = await ownsProject(userId, projectId);
    if (!own) return { ok: false, error: 'Акт не найден' };
    const data = await fileRepository.listByActId(actId);
    return { ok: true, data };
  }

  const clientProjectId = await clientRepository.getClientProjectId(userId);
  if (!clientProjectId || clientProjectId !== projectId) return { ok: false, error: 'Доступ запрещён' };

  const act = await actRepository.getById(actId);
  if (!act || !CLIENT_VISIBLE_ACT_STATUSES.has(act.status)) return { ok: false, error: 'Акт недоступен' };

  const files = await fileRepository.listByActId(actId);
  const data = files.filter((file) => file.isVisibleToClient);
  return { ok: true, data };
};
