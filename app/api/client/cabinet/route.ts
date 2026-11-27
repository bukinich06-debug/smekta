import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getClientCabinet } from '@/services/clients/getClientCabinet';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'CLIENT');
  if (roleError) return roleError;

  const data = await getClientCabinet(session.user.id);
  if (!data) return errorResponse('Кабинет не найден', 404);

  return NextResponse.json(data);
};
