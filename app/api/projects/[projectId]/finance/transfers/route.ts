import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { createWalletTransfer } from '@/services/finance/createWalletTransfer';
import type { ICreateTransferInput } from '@/domain/finance';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const body = await request.json();
  const input: ICreateTransferInput = {
    ...body,
    projectId: id,
    date: body.date ? new Date(body.date) : new Date(),
  };

  const result = await createWalletTransfer(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось создать перевод', 400);

  return NextResponse.json({ transfer: result.data }, { status: 201 });
};
