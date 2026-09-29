'use server';

import { auth } from '@/lib/auth';
import { validateLoginInput } from '@/domain/auth';
import type { ILoginInput } from '@/domain/auth';

interface ILoginResult {
  ok: boolean;
  error?: string;
}

export const login = async (input: ILoginInput): Promise<ILoginResult> => {
  const validationError = validateLoginInput(input);
  if (validationError) return { ok: false, error: validationError };

  try {
    await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
    });

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Неверный email или пароль';
    return { ok: false, error: message };
  }
};
