import { NextResponse } from 'next/server';
import { requireSession, requireRole } from '@/app/api/shared/guards';
import { listAdmins } from '@/services/users/listAdmins';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const admins = await listAdmins();

  return NextResponse.json(admins);
};
