import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { listProjectFinanceHistory } from '@/services/finance/listProjectFinanceHistory';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const result = await listProjectFinanceHistory(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить историю', result.error === 'Проект не найден' ? 404 : 403);

  return NextResponse.json(result.data);
};
