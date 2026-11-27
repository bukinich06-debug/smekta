import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateItem } from '@/services/estimates/updateItem';
import { deleteItem } from '@/services/estimates/deleteItem';
import type { IUpdateItemInput } from '@/domain/estimates';

interface IRouteContext {
  params: Promise<{ projectId: string; itemId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { itemId } = await context.params;
  const id = parseInt(itemId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID позиции', 400);

  const input: IUpdateItemInput = await request.json();

  const result = await updateItem(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка обновления позиции', result.error === 'Позиция не найдена' ? 404 : 400);

  return NextResponse.json({ item: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { itemId } = await context.params;
  const id = parseInt(itemId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID позиции', 400);

  const result = await deleteItem(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка удаления позиции', result.error === 'Позиция не найдена' ? 404 : 400);

  return NextResponse.json({ ok: true }, { status: 200 });
};
