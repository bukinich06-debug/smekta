import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';
import { validateCreateClient } from '@/domain/clients';
import type { IClientListFilters, ICreateClientInput } from '@/domain/clients';

export const GET = async (request: Request) => {
  const session = await requireSession();
  requireRole(session, 'ADMIN');

  const { searchParams } = new URL(request.url);

  const filters: IClientListFilters = {
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as any) || undefined,
    sortBy: (searchParams.get('sortBy') as any) || undefined,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
  };

  const items = await clientRepository.list(filters, session.user.id);
  return NextResponse.json(items);
};

export const POST = async (request: Request) => {
  const session = await requireSession();
  requireRole(session, 'ADMIN');

  const input: ICreateClientInput = await request.json();

  const errors = validateCreateClient(input);
  if (errors.length > 0) return errorResponse(errors.join('; '), 400);

  try {
    const client = await clientRepository.create(input, session.user.id);
    return NextResponse.json({ client }, { status: 201 });
  } catch (err) {
    console.error('Ошибка при создании заказчика:', err);
    return errorResponse('Не удалось создать заказчика. Попробуйте ещё раз.', 500);
  }
};
