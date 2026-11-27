import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { updateWalletTransfer } from '@/services/finance/updateWalletTransfer';
import { deleteWalletTransfer } from '@/services/finance/deleteWalletTransfer';
import type { IUpdateTransferInput } from '@/domain/finance';

interface IRouteContext {
  params: Promise<{ projectId: string; transferId: string }>;
}

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { transferId } = await context.params;
  const id = parseInt(transferId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID перевода', 400);

  const body = await request.json();
  const input: IUpdateTransferInput = {
    ...body,
    date: body.date ? new Date(body.date) : undefined,
  };

  const result = await updateWalletTransfer(id, input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось обновить перевод', 400);

  return NextResponse.json({ transfer: result.data });
};

export const DELETE = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { transferId } = await context.params;
  const id = parseInt(transferId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID перевода', 400);

  const result = await deleteWalletTransfer(id, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось удалить перевод', result.error === 'Перевод не найден' ? 404 : 400);

  return new Response(null, { status: 204 });
};
