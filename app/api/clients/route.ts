import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { listClients } from '@/services/clients/listClients';
import { createClient } from '@/services/clients/createClient';
import type { IClientListFilters, ICreateClientInput } from '@/domain/clients';

export const GET = async (request: Request) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { searchParams } = new URL(request.url);

  const filters: IClientListFilters = {
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as any) || undefined,
    sortBy: (searchParams.get('sortBy') as any) || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  };

  const items = await listClients(filters, session.user.id);
  return NextResponse.json(items);
};

export const POST = async (request: Request) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const input: ICreateClientInput = await request.json();

  const result = await createClient(input, session.user.id);

  if (!result.ok) return errorResponse(result.error || 'Ошибка создания', 400);

  return NextResponse.json({ client: result.client }, { status: 201 });
};
