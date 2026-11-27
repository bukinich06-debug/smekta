import 'server-only';

import { getSession } from '@/services/auth/getSession';
import { NextResponse } from 'next/server';
import type { IAuthSession } from '@/domain/auth';

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const requireSession = async (): Promise<IAuthSession> => {
  const session = await getSession();
  if (!session) throw new AuthError('Требуется авторизация', 401);
  return session;
};

export const requireRole = (session: IAuthSession, role: 'ADMIN' | 'CLIENT') => {
  if (session.user.role !== role) throw new AuthError('Недостаточно прав', 403);
};

export const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};

export const successResponse = <T>(data: T, status = 200) => {
  return NextResponse.json(data, { status });
};
