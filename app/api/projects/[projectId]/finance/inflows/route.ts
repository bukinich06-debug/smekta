import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { createInflow } from '@/services/finance/createInflow';
import type { ICreateInflowInput } from '@/domain/finance';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const POST = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const roleError = requireRole(session, 'ADMIN');
  if (roleError) return roleError;

  const { projectId } = await context.params;
  const id = parseInt(projectId, 10);
  if (isNaN(id)) return errorResponse('Неверный ID проекта', 400);

  const body = await request.json();
  const input: ICreateInflowInput = {
    ...body,
    projectId: id,
    date: body.date ? new Date(body.date) : new Date(),
  };

  const result = await createInflow(input, session.user.id);
  if (!result.ok) return errorResponse(result.error || 'Не удалось создать поступление', 400);

  return NextResponse.json({ inflow: result.data }, { status: 201 });
};
