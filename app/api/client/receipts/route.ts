import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getClientProjectReceipts } from '@/services/receipts/getClientProjectReceipts';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'CLIENT');
  if (roleError) return errorResponse('Доступ только для заказчиков', 403);

  const result = await getClientProjectReceipts(session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить чеки', 404);

  return NextResponse.json(result.data);
};
