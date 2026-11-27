import { NextResponse } from 'next/server';
import { requireSession, errorResponse } from '@/app/api/shared/guards';
import { clientRepository } from '@/data/clients';
import { listProjectReceiptFiles } from '@/services/files/listProjectReceiptFiles';

export const GET = async () => {
  const session = await requireSession();
  if (session instanceof NextResponse) return session;

  if (session.user.role !== 'CLIENT') {
    return errorResponse('Доступ запрещён', 403);
  }

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);

  if (!cabinet?.project) {
    return errorResponse('Проект не найден', 404);
  }

  const files = await listProjectReceiptFiles(cabinet.project.id);

  return NextResponse.json(files);
};
