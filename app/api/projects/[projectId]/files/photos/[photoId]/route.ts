import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updatePhotoFile } from '@/services/files/updatePhotoFile';
import { deletePhotoFile } from '@/services/files/deletePhotoFile';

interface IRouteContext {
  params: Promise<{ projectId: string; photoId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { photoId } = await context.params;
  const id = parseInt(photoId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID фото', 400);

  const body = await request.json();
  const result = await updatePhotoFile(id, body, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить фото', 400);

  return NextResponse.json({ ok: true });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { photoId } = await context.params;
  const id = parseInt(photoId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID фото', 400);

  const result = await deletePhotoFile(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить фото', result.error === 'Файл не найден' ? 404 : 400);

  return new Response(null, { status: 204 });
};
