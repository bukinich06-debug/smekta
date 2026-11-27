import 'server-only';

import { clientRepository } from '@/data/clients';
import { extraWorkRepository } from '@/data/extra-works';
import type { IClientProjectExtraWorks } from '@/domain/extra-works';

interface IResult {
  ok: boolean;
  data?: IClientProjectExtraWorks | null;
  error?: string;
}

export const getClientProjectExtraWorks = async (userId: number): Promise<IResult> => {
  const cabinet = await clientRepository.getCabinetByUserId(userId);

  if (!cabinet?.project) return { ok: false, error: 'Проект не найден' };

  const data = await extraWorkRepository.getClientVisibleByProjectId(cabinet.project.id);
  return { ok: true, data };
};
