import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getProjectTz } from '@/services/project-tz/getProjectTz';
import { updateProjectTz } from '@/services/project-tz/updateProjectTz';

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

  const result = await getProjectTz(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить ТЗ', result.error === 'Проект не найден' ? 404 : 403);

  return NextResponse.json(result.data);
};

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const body = await request.json();
  const { text } = body;

  if (typeof text !== 'string') return errorResponse('Текст ТЗ обязателен', 400);

  const result = await updateProjectTz(id, text, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить ТЗ', 400);

  return NextResponse.json({ tz: result.data });
};
