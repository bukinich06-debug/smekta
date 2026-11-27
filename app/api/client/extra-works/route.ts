import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getClientProjectExtraWorks } from '@/services/extra-works/getClientProjectExtraWorks';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'CLIENT');
  if (roleError) return roleError;

  const result = await getClientProjectExtraWorks(session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить допработы', 404);

  return NextResponse.json(result.data);
};
