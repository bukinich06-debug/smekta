import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { AdminPageWrapper } from '@/components/admin-page-wrapper';
import { CreateClientForm } from '@/components/create-client-form';

const AdminCreateClientPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return (
    <AdminPageWrapper userName={session.user.name}>
      <CreateClientForm />
    </AdminPageWrapper>
  );
};

export default AdminCreateClientPage;
