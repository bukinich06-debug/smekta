import { NextResponse } from 'next/server';
import { requireSession, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';

export const GET = async () => {
  const session = await requireSession();

  if (session.user.role === 'ADMIN') {
    return errorResponse('Эта страница для заказчиков', 403);
  }

  if (session.user.role !== 'CLIENT') {
    return errorResponse('Недостаточно прав', 403);
  }

  const data = await clientRepository.getCabinetByUserId(session.user.id);
  if (!data) return errorResponse('Кабинет не найден', 404);

  return NextResponse.json(data);
};
