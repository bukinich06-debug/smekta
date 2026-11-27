import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getAdminStats } from '@/services/stats/getAdminStats';
import type { IAdminStatsFilters } from '@/domain/stats';

export const GET = async (request: Request) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const url = new URL(request.url);
  const clientId = url.searchParams.get('clientId');

  const filters: IAdminStatsFilters = {
    clientId: clientId ? parseInt(clientId, 10) : null,
  };

  const result = await getAdminStats(filters, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось загрузить статистику', 400);

  return NextResponse.json(result.data);
};
