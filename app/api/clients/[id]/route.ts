import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { getClientCard } from '@/services/clients/getClientCard';
import { updateClientCard } from '@/services/clients/updateClientCard';
import type { IUpdateClientCardInput } from '@/domain/clients';

interface IRouteContext {
  params: Promise<{ id: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { id } = await context.params;
  const clientId = parseInt(id, 10);
  if (isNaN(clientId)) return errorResponse('Неверный ID', 400);

  const data = await getClientCard(clientId, session.user.id);
  if (!data) return errorResponse('Заказчик не найден', 404);

  return NextResponse.json(data);
};

export const PATCH = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { id } = await context.params;
  const clientId = parseInt(id, 10);
  if (isNaN(clientId)) return errorResponse('Неверный ID', 400);

  const body = await request.json();
  const { projectId, ...input } = body as { projectId: number } & IUpdateClientCardInput;

  if (!projectId) return errorResponse('projectId обязателен', 400);

  const result = await updateClientCard(clientId, projectId, input, session.user.id);

  if (!result.ok) return errorResponse(result.error || 'Ошибка обновления', 400);

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath('/admin/clients');

  return NextResponse.json({ ok: true });
};
