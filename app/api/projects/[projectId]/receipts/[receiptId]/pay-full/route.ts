import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { payReceiptFull } from '@/services/receipts/payReceiptFull';

interface IRouteContext {
  params: Promise<{ projectId: string; receiptId: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { receiptId } = await context.params;
  const id = parseInt(receiptId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID чека', 400);

  const body = await request.json();
  const date = body.date ? new Date(body.date) : new Date();

  const result = await payReceiptFull(id, date, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось оплатить чек', result.error === 'Чек не найден' ? 404 : 400);

  return NextResponse.json({ ok: true });
};
