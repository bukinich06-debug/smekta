import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateInflow } from '@/services/finance/updateInflow';
import { deleteInflow } from '@/services/finance/deleteInflow';
import type { IUpdateInflowInput } from '@/domain/finance';

interface IRouteContext {
  params: Promise<{ projectId: string; inflowId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { inflowId } = await context.params;
  const id = parseInt(inflowId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID поступления', 400);

  const body = await request.json();
  const input: IUpdateInflowInput = {
    ...body,
    date: body.date ? new Date(body.date) : undefined,
  };

  const result = await updateInflow(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить поступление', 400);

  return NextResponse.json({ inflow: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { inflowId } = await context.params;
  const id = parseInt(inflowId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID поступления', 400);

  const result = await deleteInflow(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить поступление', result.error === 'Поступление не найдено' ? 404 : 400);

  return new Response(null, { status: 204 });
};
