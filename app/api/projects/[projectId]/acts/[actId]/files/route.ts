import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { listActFiles } from '@/services/files/listActFiles';
import { uploadActFile } from '@/services/files/uploadActFile';

interface IRouteContext {
  params: Promise<{ projectId: string; actId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { actId } = await context.params;
  const id = parseInt(actId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID акта', 400);

  const result = await listActFiles(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить файлы', 404);

  return NextResponse.json(result.data);
};

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { actId } = await context.params;
  const id = parseInt(actId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID акта', 400);

  const formData = await request.formData();
  formData.set('actId', String(id));

  const result = await uploadActFile(formData, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить файл', 400);

  return NextResponse.json({ ok: true }, { status: 201 });
};
