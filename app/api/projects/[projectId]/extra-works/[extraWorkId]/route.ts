import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateExtraWork } from '@/services/extra-works/updateExtraWork';
import { deleteExtraWork } from '@/services/extra-works/deleteExtraWork';
import type { IUpdateExtraWorkInput } from '@/domain/extra-works';

interface IRouteContext {
  params: Promise<{ projectId: string; extraWorkId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { extraWorkId } = await context.params;
  const id = parseInt(extraWorkId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID допработы', 400);

  const body = await request.json();
  const input: IUpdateExtraWorkInput = {
    ...body,
    date: body.date ? new Date(body.date) : undefined,
  };

  const result = await updateExtraWork(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить допработу', 400);

  return NextResponse.json({ extraWork: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { extraWorkId } = await context.params;
  const id = parseInt(extraWorkId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID допработы', 400);

  const result = await deleteExtraWork(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить допработу', result.error === 'Допработа не найдена' ? 404 : 400);

  return new Response(null, { status: 204 });
};
