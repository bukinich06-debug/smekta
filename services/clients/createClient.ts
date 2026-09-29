'use server';

import { clientRepository } from '@/data/clients';
import type { ICreateClientInput, IClientWithProject } from '@/domain/clients';
import { validateCreateClient } from '@/domain/clients';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';

interface ICreateClientResult {
  ok: boolean;
  error?: string;
  client?: IClientWithProject;
}

export const createClient = async (input: ICreateClientInput): Promise<ICreateClientResult> => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const errors = validateCreateClient(input);
  if (errors.length > 0) return { ok: false, error: errors.join('; ') };

  try {
    const client = await clientRepository.create(input, session.user.id);
    return { ok: true, client };
  } catch (err) {
    console.error('Ошибка при создании заказчика:', err);
    return { ok: false, error: 'Не удалось создать заказчика. Попробуйте ещё раз.' };
  }
};
