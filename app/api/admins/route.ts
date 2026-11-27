import { NextResponse } from 'next/server';
import { requireSession, requireRole } from '@/app/api/shared/guards';
import { dbClient } from '@/data/shared/dbClient';

export const GET = async () => {
  const session = await requireSession();
  requireRole(session, 'ADMIN');

  const admins = await dbClient.user.findMany({
    where: {
      role: 'ADMIN',
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return NextResponse.json(admins);
};
