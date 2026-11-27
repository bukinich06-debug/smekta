import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { listProjectPhotos } from '@/services/files/listProjectPhotos';
import { uploadPhotoFile } from '@/services/files/uploadPhotoFile';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const result = await listProjectPhotos(id, session.user.id, session.user.role);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить фото', 404);

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

  const formData = await request.formData();
  formData.set('projectId', String(id));

  const result = await uploadPhotoFile(formData, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить фото', 400);

  return NextResponse.json({ ok: true }, { status: 201 });
};
