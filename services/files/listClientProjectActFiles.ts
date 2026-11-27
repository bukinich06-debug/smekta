import 'server-only';

import { fileRepository } from '@/data/files';
import { actRepository } from '@/data/acts';
import type { IFile } from '@/domain/files';
import { CLIENT_VISIBLE_ACT_STATUSES } from './helpers/constants';

export const listClientProjectActFiles = async (projectId: number): Promise<IFile[]> => {
  const all = await fileRepository.listByProjectIdActs(projectId);
  
  const actIds = Array.from(new Set(all.map((f) => f.actId).filter((id): id is number => id !== null)));
  const acts = await Promise.all(actIds.map((id) => actRepository.getById(id)));
  const visibleActIds = new Set(
    acts.filter((act) => act && CLIENT_VISIBLE_ACT_STATUSES.has(act.status)).map((act) => act!.id)
  );

  return all.filter((file) => file.isVisibleToClient && file.actId !== null && visibleActIds.has(file.actId));
};
