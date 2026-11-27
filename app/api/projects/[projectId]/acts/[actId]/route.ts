import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateAct } from '@/services/acts/updateAct';
import { deleteAct } from '@/services/acts/deleteAct';
import type { IUpdateActInput } from '@/domain/acts';

interface IRouteContext {
  params: Promise<{ projectId: string; actId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { actId } = await context.params;
  const id = parseInt(actId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID акта', 400);

  const body = await request.json();
  const input: IUpdateActInput = {
    ...body,
    date: body.date ? new Date(body.date) : undefined,
  };

  const result = await updateAct(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить акт', 400);

  return NextResponse.json({ act: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { actId } = await context.params;
  const id = parseInt(actId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID акта', 400);

  const result = await deleteAct(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить акт', result.error === 'Акт не найден' ? 404 : 400);

  return new Response(null, { status: 204 });
};
