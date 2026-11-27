import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { listReceiptFiles } from '@/services/files/listReceiptFiles';
import { uploadReceiptFile } from '@/services/files/uploadReceiptFile';

interface IRouteContext {
  params: Promise<{ projectId: string; receiptId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { receiptId } = await context.params;
  const id = parseInt(receiptId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID чека', 400);

  const result = await listReceiptFiles(id, session.user.id, session.user.role);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить файлы', 404);

  return NextResponse.json(result.data);
};

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { receiptId } = await context.params;
  const id = parseInt(receiptId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID чека', 400);

  const formData = await request.formData();
  formData.set('receiptId', String(id));

  const result = await uploadReceiptFile(formData, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить файл', 400);

  return NextResponse.json({ ok: true }, { status: 201 });
};
