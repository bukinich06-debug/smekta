import 'server-only';

import { clientRepository } from '@/data/clients';
import { receiptRepository } from '@/data/receipts';
import type { IProjectReceipts } from '@/domain/receipts';

interface IResult {
  ok: boolean;
  data?: IProjectReceipts;
  error?: string;
}

export const getClientProjectReceipts = async (userId: number): Promise<IResult> => {
  const cabinet = await clientRepository.getCabinetByUserId(userId);

  if (!cabinet?.project) return { ok: false, error: 'Проект не найден' };

  const data = await receiptRepository.getByProjectId(cabinet.project.id);
  return { ok: true, data };
};
