import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { generateInviteToken } from '@/services/clients/generateInviteToken';

interface IRouteContext {
  params: Promise<{ id: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { id } = await context.params;
  const clientId = parseInt(id, 10);
  if (isNaN(clientId)) return errorResponse('Неверный ID', 400);

  const result = await generateInviteToken(clientId, session.user.id);

  if ('error' in result) return errorResponse(result.error, 400);

  return NextResponse.json({ token: result.token });
};
