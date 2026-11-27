import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { acceptInvite } from '@/services/clients/acceptInvite';

interface IRouteContext {
  params: Promise<{ token: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'CLIENT');
  if (roleError) return roleError;

  const { token } = await context.params;

  const result = await acceptInvite(token, session.user.id);

  if (!result.success) {
    return errorResponse(result.error || 'Ошибка принятия инвайта', 400);
  }

  return NextResponse.json({ success: true });
};
