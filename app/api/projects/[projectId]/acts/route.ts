import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getProjectActs } from '@/services/acts/getProjectActs';
import { createAct } from '@/services/acts/createAct';
import type { ICreateActInput } from '@/domain/acts';

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

  const result = await getProjectActs(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить акты', result.error === 'Проект не найден' ? 404 : 403);

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
  const input: ICreateActInput = {
    ...body,
    projectId: id,
    date: body.date ? new Date(body.date) : new Date(),
  };

  const result = await createAct(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось создать акт', 400);

  return NextResponse.json({ act: result.data }, { status: 201 });
};
