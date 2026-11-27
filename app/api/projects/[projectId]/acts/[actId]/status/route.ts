import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateActStatus } from '@/services/acts/updateActStatus';
import type { ActStatus } from '@prisma/client';

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
  const { status } = body as { status: ActStatus };

  if (!status) return errorResponse('Статус обязателен', 400);

  const result = await updateActStatus(id, status, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось изменить статус', 400);

  return NextResponse.json({ act: result.data });
};
