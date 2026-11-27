import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { toggleItemVisibility } from '@/services/estimates/toggleItemVisibility';

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

  const result = await toggleItemVisibility(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка изменения видимости', result.error === 'Позиция не найдена' ? 404 : 400);

  return NextResponse.json({ item: result.data });
};
