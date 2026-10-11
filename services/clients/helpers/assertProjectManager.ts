import { clientRepository } from '@/data/clients';
import { redirect } from 'next/navigation';

export const ownsProject = async (userId: number, projectId: number): Promise<boolean> =>
  clientRepository.isManager(userId, { projectId });

export const ownsClient = async (userId: number, clientId: number): Promise<boolean> =>
  clientRepository.isManager(userId, { clientId });

export const requireOwnProject = async (userId: number, projectId: number) => {
  const ok = await ownsProject(userId, projectId);
  if (!ok) redirect('/admin/clients');
};

export const requireOwnClient = async (userId: number, clientId: number) => {
  const ok = await ownsClient(userId, clientId);
  if (!ok) redirect('/admin/clients');
};
