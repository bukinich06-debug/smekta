import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateSection } from '@/services/estimates/updateSection';
import { deleteSection } from '@/services/estimates/deleteSection';
import type { IUpdateSectionInput } from '@/domain/estimates';

interface IRouteContext {
  params: Promise<{ projectId: string; sectionId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { sectionId } = await context.params;
  const id = parseInt(sectionId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID раздела', 400);

  const input: IUpdateSectionInput = await request.json();

  const result = await updateSection(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка обновления раздела', result.error === 'Раздел не найден' ? 404 : 400);

  return NextResponse.json({ section: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { sectionId } = await context.params;
  const id = parseInt(sectionId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID раздела', 400);

  const result = await deleteSection(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Ошибка удаления раздела', result.error === 'Раздел не найден' ? 404 : 400);

  return NextResponse.json({ ok: true }, { status: 200 });
};
