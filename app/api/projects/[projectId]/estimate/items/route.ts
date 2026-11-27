import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { createItem } from '@/services/estimates/createItem';
import type { ICreateItemInput } from '@/domain/estimates';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const input: ICreateItemInput = await request.json();

  const result = await createItem(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка создания позиции', 400);

  return NextResponse.json({ item: result.data }, { status: 201 });
};
