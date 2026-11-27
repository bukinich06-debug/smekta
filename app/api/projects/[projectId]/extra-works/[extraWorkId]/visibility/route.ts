import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { toggleExtraWorkVisibility } from '@/services/extra-works/toggleExtraWorkVisibility';

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

  const result = await toggleExtraWorkVisibility(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось изменить видимость', 400);

  return NextResponse.json({ extraWork: result.data });
};
