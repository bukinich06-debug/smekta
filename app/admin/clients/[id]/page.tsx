import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { AdminPageWrapper } from '@/components/admin-page-wrapper';
import { ClientCard } from '@/components/client-card';
import { getClientCard } from '@/services/clients/getClientCard';
import { listAdmins } from '@/services/users/listAdmins';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const AdminClientDetailPage = async ({ params }: IPageProps) => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const { id } = await params;
  const clientId = parseInt(id, 10);

  if (isNaN(clientId)) notFound();

  const [data, admins] = await Promise.all([getClientCard(clientId), listAdmins()]);

  if (!data) notFound();

  return (
    <AdminPageWrapper userName={session.user.name}>
      <ClientCard data={data} admins={admins} />
    </AdminPageWrapper>
  );
};

export default AdminClientDetailPage;
