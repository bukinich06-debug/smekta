import { NextResponse } from 'next/server';
import { requireSession, errorResponse } from '@/app/api/shared/guards';
import { listTzFiles } from '@/services/files/listTzFiles';
import { uploadTzFile } from '@/services/files/uploadTzFile';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const result = await listTzFiles(id, session.user.id, session.user.role);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить файлы', 404);

  return NextResponse.json(result.data);
};

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  if (session.user.role !== 'ADMIN') return errorResponse('Недостаточно прав', 403);

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const formData = await request.formData();
  formData.set('projectId', String(id));

  const result = await uploadTzFile(formData, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить файл', 400);

  return NextResponse.json({ ok: true }, { status: 201 });
};
