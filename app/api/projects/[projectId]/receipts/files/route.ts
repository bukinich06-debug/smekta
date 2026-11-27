import { NextResponse } from 'next/server';
import { requireSession, requireRole, errorResponse } from '@/app/api/shared/guards';
import { ownsProject } from '@/services/clients/helpers/assertProjectManager';
import { listProjectReceiptFiles } from '@/services/files/listProjectReceiptFiles';

interface IRouteContext {
  params: Promise<{ projectId: string }>;
}

export const GET = async (request: Request, context: IRouteContext) => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  const { projectId: projectIdStr } = await context.params;
  const projectId = parseInt(projectIdStr, 10);
  if (isNaN(projectId)) return errorResponse('Неверный ID проекта', 400);

  if (session.user.role === 'CLIENT') {
    return errorResponse('Доступ запрещён', 403);
  }

  const hasAccess = await ownsProject(session.user.id, projectId);
  if (!hasAccess) return errorResponse('Проект не найден', 404);

  const files = await listProjectReceiptFiles(projectId);

  return NextResponse.json(files);
};
