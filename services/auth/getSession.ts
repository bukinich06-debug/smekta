'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { IAuthSession } from '@/domain/auth';

export const getSession = async (): Promise<IAuthSession | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) return null;

  return {
    user: {
      id: Number(session.user.id),
      email: session.user.email,
      name: session.user.name,
      role: (session.user.role as 'ADMIN' | 'CLIENT') || 'CLIENT',
      isActive: true,
    },
    session: {
      id: session.session.id,
      expiresAt: new Date(session.session.expiresAt),
    },
  };
};
