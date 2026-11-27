import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getProjectReceipts } from '@/services/receipts/getProjectReceipts';
import { createReceipt } from '@/services/receipts/createReceipt';
import type { ICreateReceiptInput } from '@/domain/receipts';

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

  const result = await getProjectReceipts(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить чеки', result.error === 'Проект не найден' ? 404 : 403);

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
  const input: ICreateReceiptInput = {
    ...body,
    projectId: id,
    date: body.date ? new Date(body.date) : new Date(),
  };

  const result = await createReceipt(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось создать чек', 400);

  return NextResponse.json({ receipt: result.data }, { status: 201 });
};
