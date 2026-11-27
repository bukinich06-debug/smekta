import 'server-only';

import { getSession } from '@/services/auth/getSession';
import { NextResponse } from 'next/server';
import type { IAuthSession } from '@/domain/auth';

export const requireSession = async (): Promise<IAuthSession | NextResponse> => {
  const session = await getSession();
  if (!session) return errorResponse('Требуется авторизация', 401);
  return session;
};

export const requireRole = (session: IAuthSession, role: 'ADMIN' | 'CLIENT'): NextResponse | null => {
  if (session.user.role !== role) return errorResponse('Недостаточно прав', 403);
  return null;
};

export const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};

export const successResponse = <T>(data: T, status = 200) => {
  return NextResponse.json(data, { status });
};
