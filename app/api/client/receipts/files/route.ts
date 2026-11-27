import { NextResponse } from 'next/server';
import { requireSession, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';
import { listClientProjectReceiptFiles } from '@/services/files/listClientProjectReceiptFiles';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  if (session.user.role !== 'CLIENT') {
    return errorResponse('Доступ запрещён', 403);
  }

  const projectId = await clientRepository.getClientProjectId(session.user.id);

  if (!projectId) {
    return errorResponse('Проект не найден', 404);
  }

  const files = await listClientProjectReceiptFiles(projectId);

  return NextResponse.json(files);
};
