import 'server-only';

import { clientRepository } from '@/data/clients';
import { actRepository } from '@/data/acts';
import type { IClientProjectActs } from '@/domain/acts';

interface IResult {
  ok: boolean;
  data?: IClientProjectActs | null;
  error?: string;
}

export const getClientProjectActs = async (userId: number): Promise<IResult> => {
  const cabinet = await clientRepository.getCabinetByUserId(userId);

  if (!cabinet?.project) return { ok: false, error: 'Проект не найден' };

  const data = await actRepository.getClientVisibleByProjectId(cabinet.project.id);
  return { ok: true, data };
};
