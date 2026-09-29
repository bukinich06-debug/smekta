'use server';

import { auth } from '@/lib/auth';
import { validateRegisterInput } from '@/domain/auth';
import type { IRegisterInput } from '@/domain/auth';

interface IRegisterResult {
  ok: boolean;
  error?: string;
}

export const register = async (input: IRegisterInput): Promise<IRegisterResult> => {
  const validationError = validateRegisterInput(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
      },
    });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка при регистрации';
    return { ok: false, error: message };
  }
};
