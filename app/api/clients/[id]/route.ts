import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';
import { ownsClient, ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { validateUpdateClientCard } from '@/domain/clients';
import type { IUpdateClientCardInput } from '@/domain/clients';

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const session = await requireSession();
  requireRole(session, 'ADMIN');

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return errorResponse('Неверный ID', 400);

  const own = await ownsClient(session.user.id, id);
  if (!own) return errorResponse('Заказчик не найден', 404);

  const data = await clientRepository.getCardDetails(id);
  if (!data) return errorResponse('Заказчик не найден', 404);

  return NextResponse.json(data);
};

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const session = await requireSession();
  requireRole(session, 'ADMIN');

  const clientId = parseInt(params.id, 10);
  if (isNaN(clientId)) return errorResponse('Неверный ID', 400);

  const body = await request.json();
  const { projectId, ...input } = body as { projectId: number } & IUpdateClientCardInput;

  if (!projectId) return errorResponse('projectId обязателен', 400);

  const ownClient = await ownsClient(session.user.id, clientId);
  const ownProject = await ownsProject(session.user.id, projectId);
  if (!ownClient || !ownProject) return errorResponse('Заказчик не найден', 404);

  const errors = validateUpdateClientCard(input);
  if (errors.length > 0) return errorResponse(errors.join('; '), 400);

  try {
    await clientRepository.updateCard(clientId, projectId, input);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Ошибка при обновлении карточки:', err);
    return errorResponse('Не удалось обновить карточку. Попробуйте ещё раз.', 500);
  }
};
