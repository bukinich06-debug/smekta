import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { deleteTzFile } from '@/services/files/deleteTzFile';

interface IRouteContext {
  params: Promise<{ projectId: string; fileId: string }>;
}

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { fileId } = await context.params;
  const id = parseInt(fileId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID файла', 400);

  const result = await deleteTzFile(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить файл', result.error === 'Файл не найден' ? 404 : 400);

  return new Response(null, { status: 204 });
};
