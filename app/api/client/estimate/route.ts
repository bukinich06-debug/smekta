import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getClientProjectEstimate } from '@/services/estimates/getClientProjectEstimate';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'CLIENT');
  if (roleError) return roleError;

  const data = await getClientProjectEstimate(session.user.id);
  if (!data) return NextResponse.json(null);

  return NextResponse.json(data);
};
