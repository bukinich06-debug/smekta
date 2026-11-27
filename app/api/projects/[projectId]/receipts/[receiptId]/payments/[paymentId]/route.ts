import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { deletePayment } from '@/services/receipts/deletePayment';

interface IRouteContext {
  params: Promise<{ projectId: string; receiptId: string; paymentId: string }>;
}

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { paymentId } = await context.params;
  const id = parseInt(paymentId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID оплаты', 400);

  const result = await deletePayment(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить оплату', result.error === 'Оплата не найдена' ? 404 : 400);

  return NextResponse.json({ ok: true });
};
