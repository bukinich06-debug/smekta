import { NextResponse } from 'next/server';
import { errorResponse } from '@/app/api/shared/guards';
import { getClientByInviteToken } from '@/services/clients/getClientByInviteToken';

interface IRouteContext {
  params: Promise<{ token: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const { token } = await context.params;

  const client = await getClientByInviteToken(token);
  if (!client) return errorResponse('Ссылка недействительна или уже использована', 404);

  return NextResponse.json(client);
};
