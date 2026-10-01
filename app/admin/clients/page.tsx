import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { listClients } from '@/services/clients/listClients';
import { AdminPageWrapper } from '@/components/admin-page-wrapper';
import { ClientsList } from '@/components/clients-list';
import type { ProjectStatus } from '@prisma/client';

interface IPageProps {
  searchParams: Promise<{
    search?: string;
    status?: ProjectStatus;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>;
}

const AdminClientsPage = async ({ searchParams }: IPageProps) => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const params = await searchParams;

  const items = await listClients({
    search: params.search,
    status: params.status,
    sortBy: params.sortBy as
      | 'fullName'
      | 'address'
      | 'estimateTotal'
      | 'receivedTotal'
      | 'masteredTotal'
      | 'balanceOnHand'
      | 'dueNow'
      | 'startDate'
      | 'updatedAt'
      | undefined,
    sortOrder: params.sortOrder,
  });

  return (
    <AdminPageWrapper userName={session.user.name}>
      <ClientsList items={items} />
    </AdminPageWrapper>
  );
};

export default AdminClientsPage;
