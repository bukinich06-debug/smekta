import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { createSection } from '@/services/estimates/createSection';
import type { ICreateSectionInput } from '@/domain/estimates';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const body = await request.json();
  const input: ICreateSectionInput = { projectId: id, name: body.name };

  const result = await createSection(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка создания раздела', 400);

  return NextResponse.json({ section: result.data }, { status: 201 });
};
