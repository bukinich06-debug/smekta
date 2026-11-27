import { NextResponse } from 'next/server';
import { requireSession, errorResponse } from '@/app/api/shared/guards';
import { getClientProjectTz } from '@/services/project-tz/getClientProjectTz';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  if (session.user.role !== 'CLIENT') return errorResponse('Недостаточно прав', 403);

  const result = await getClientProjectTz(session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить ТЗ', 404);

  return NextResponse.json(result.data);
};
