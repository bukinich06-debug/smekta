import 'server-only';

import { projectTzRepository } from '@/data/project-tz';
import type { IProjectTz } from '@/domain/project-tz';

interface IResult {
  ok: boolean;
  data?: IProjectTz | null;
  error?: string;
}

export const getClientProjectTz = async (userId: number): Promise<IResult> => {
  const data = await projectTzRepository.getByClientUserId(userId);
  if (!data) return { ok: false, error: 'ТЗ не найдено' };
  return { ok: true, data };
};
