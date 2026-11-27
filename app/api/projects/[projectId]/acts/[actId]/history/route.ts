import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { listActStatusHistory } from '@/services/acts/listActStatusHistory';

interface IRouteContext {
  params: Promise<{ projectId: string; actId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { actId } = await context.params;
  const id = parseInt(actId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID акта', 400);

  const result = await listActStatusHistory(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить историю', result.error === 'Акт не найден' ? 404 : 403);

  return NextResponse.json(result.data);
};
