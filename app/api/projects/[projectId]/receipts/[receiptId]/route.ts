import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateReceipt } from '@/services/receipts/updateReceipt';
import { deleteReceipt } from '@/services/receipts/deleteReceipt';
import type { IUpdateReceiptInput } from '@/domain/receipts';

interface IRouteContext {
  params: Promise<{ projectId: string; receiptId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { receiptId } = await context.params;
  const id = parseInt(receiptId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID чека', 400);

  const body = await request.json();
  const input: IUpdateReceiptInput = {
    ...body,
    date: body.date ? new Date(body.date) : undefined,
  };

  const result = await updateReceipt(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить чек', result.error === 'Чек не найден' ? 404 : 400);

  return NextResponse.json({ receipt: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { receiptId } = await context.params;
  const id = parseInt(receiptId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID чека', 400);

  const result = await deleteReceipt(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить чек', result.error === 'Чек не найден' ? 404 : 400);

  return NextResponse.json({ ok: true });
};
