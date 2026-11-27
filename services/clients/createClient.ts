import 'server-only';

import { clientRepository } from '@/data/clients';
import type { ICreateClientInput, IClientWithProject } from '@/domain/clients';
import { validateCreateClient } from '@/domain/clients';

interface ICreateClientResult {
  ok: boolean;
  error?: string;
  client?: IClientWithProject;
}

export const createClient = async (input: ICreateClientInput, userId: number): Promise<ICreateClientResult> => {
  const errors = validateCreateClient(input);
  if (errors.length > 0) return { ok: false, error: errors.join('; ') };

  try {
    const client = await clientRepository.create(input, userId);
    return { ok: true, client };
  } catch (err) {
    console.error('Ошибка при создании заказчика:', err);
    return { ok: false, error: 'Не удалось создать заказчика. Попробуйте ещё раз.' };
  }
};
