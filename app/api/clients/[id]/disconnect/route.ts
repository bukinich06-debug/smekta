import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';
import { ownsClient } from '@/services/clients/helpers/assertProjectManager';

export const POST = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const session = await requireSession();
  requireRole(session, 'ADMIN');

  const clientId = parseInt(params.id, 10);
  if (isNaN(clientId)) return errorResponse('Неверный ID', 400);

  const own = await ownsClient(session.user.id, clientId);
  if (!own) return errorResponse('Заказчик не найден', 404);

  const client = await clientRepository.getById(clientId);
  if (!client) return errorResponse('Заказчик не найден', 404);
  if (!client.userId) return errorResponse('Заказчик не подключён к аккаунту', 400);

  const disconnected = await clientRepository.disconnectLinkedUser(clientId);
  if (!disconnected) return errorResponse('Не удалось отключить заказчика', 500);

  return NextResponse.json({ ok: true });
};
