import { NextResponse } from 'next/server';
import { errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';

export const GET = async (
  request: Request,
  { params }: { params: { token: string } }
) => {
  const { token } = params;

  const client = await clientRepository.getByInviteToken(token);
  if (!client) return errorResponse('Ссылка недействительна или уже использована', 404);

  return NextResponse.json(client);
};
