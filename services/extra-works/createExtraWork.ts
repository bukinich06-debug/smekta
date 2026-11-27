import 'server-only';

import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { extraWorkRepository } from '@/data/extra-works';
import { validateCreateExtraWork } from '@/domain/extra-works';
import type { ICreateExtraWorkInput, IExtraWork } from '@/domain/extra-works';
import { revalidateExtraWorkPaths } from '@/services/extra-works/helpers/revalidateExtraWorkPaths';

interface IResult {
  ok: boolean;
  data?: IExtraWork;
  error?: string;
}

export const createExtraWork = async (input: ICreateExtraWorkInput, userId: number): Promise<IResult> => {
  if (!(await ownsProject(userId, input.projectId)))
    return { ok: false, error: 'Проект не найден' };

  const validationError = validateCreateExtraWork(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    const data = await extraWorkRepository.create(input);
    revalidateExtraWorkPaths();
    return { ok: true, data };
  } catch (error) {
    console.error('Ошибка при создании допработы:', error);
    return { ok: false, error: 'Не удалось создать допработу' };
  }
};
