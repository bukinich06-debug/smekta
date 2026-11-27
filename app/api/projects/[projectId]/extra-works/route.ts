import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getProjectExtraWorks } from '@/services/extra-works/getProjectExtraWorks';
import { createExtraWork } from '@/services/extra-works/createExtraWork';
import type { ICreateExtraWorkInput } from '@/domain/extra-works';

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

  const result = await getProjectExtraWorks(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить допработы', result.error === 'Проект не найден' ? 404 : 403);

  return NextResponse.json(result.data);
};

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const body = await request.json();
  const input: ICreateExtraWorkInput = {
    ...body,
    projectId: id,
    date: body.date ? new Date(body.date) : new Date(),
  };

  const result = await createExtraWork(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось создать допработу', 400);

  return NextResponse.json({ extraWork: result.data }, { status: 201 });
};
