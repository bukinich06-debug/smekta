import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { addPayment } from '@/services/receipts/addPayment';
import type { IAddPaymentInput } from '@/domain/receipts';

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
  const input: IAddPaymentInput = {
    receiptId: id,
    date: body.date ? new Date(body.date) : new Date(),
    amount: body.amount,
    comment: body.comment,
  };

  const result = await addPayment(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось добавить оплату', 400);

  return NextResponse.json({ payment: result.data }, { status: 201 });
};
