import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { AdminPageWrapper } from '@/components/admin-page-wrapper';

const AdminStatsPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  return (
    <AdminPageWrapper userName={session.user.name}>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Статистика</h1>
        <p className="text-gray-500">Страница в разработке</p>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminStatsPage;
