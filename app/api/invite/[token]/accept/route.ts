import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';

export const POST = async (
  request: Request,
  { params }: { params: { token: string } }
) => {
  const session = await requireSession();
  requireRole(session, 'CLIENT');

  const { token } = params;

  const client = await clientRepository.getByInviteToken(token);
  if (!client) return errorResponse('Ссылка недействительна или уже использована', 404);

  const userAlreadyLinked = await clientRepository.getById(client.id);

  if (userAlreadyLinked?.userId && userAlreadyLinked.userId !== session.user.id) {
    return errorResponse('Этот проект уже подключён к другому аккаунту', 400);
  }

  const accepted = await clientRepository.acceptInvite(token, session.user.id);
  if (!accepted) return errorResponse('Ссылка недействительна или уже использована', 404);

  return NextResponse.json({ success: true });
};
