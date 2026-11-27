import { NextResponse } from 'next/server';
import { requireSession, errorResponse } from '@/app/api/shared/guards';
import { getClientProjectExtraWorks } from '@/services/extra-works/getClientProjectExtraWorks';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  if (session.user.role !== 'CLIENT') return errorResponse('Недостаточно прав', 403);

  const result = await getClientProjectExtraWorks(session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить допработы', 404);

  return NextResponse.json(result.data);
};
