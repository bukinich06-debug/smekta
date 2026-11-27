import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { markExtraWorkDone } from '@/services/extra-works/markExtraWorkDone';
import { unmarkExtraWorkDone } from '@/services/extra-works/unmarkExtraWorkDone';

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

  const result = await markExtraWorkDone(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось отметить выполненной', 400);

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

  const result = await unmarkExtraWorkDone(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось снять отметку выполнения', 400);

  return NextResponse.json({ extraWork: result.data });
};
