'use server';

import { fileRepository } from '@/data/files';
import { receiptRepository } from '@/data/receipts';
import type { IFile } from '@/domain/files';
import { getSession } from '@/services/auth/getSession';
import { redirect } from 'next/navigation';
import { clientRepository } from '@/data/clients';

export const listReceiptFiles = async (receiptId: number): Promise<IFile[]> => {
  const session = await getSession();

  if (!session) redirect('/login');

  const projectId = await receiptRepository.getProjectIdByReceiptId(receiptId);
  if (!projectId) return [];

  if (session.user.role === 'ADMIN') {
    return await fileRepository.listByReceiptId(receiptId);
  }

  if (session.user.role !== 'CLIENT') redirect('/login');

  const cabinet = await clientRepository.getCabinetByUserId(session.user.id);
  if (!cabinet?.project || cabinet.project.id !== projectId) return [];

  const files = await fileRepository.listByReceiptId(receiptId);

  return files.filter((file) => file.isVisibleToClient);
};
