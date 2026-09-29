import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';
import { AdminPageWrapper } from '@/components/admin-page-wrapper';

interface IPageProps {
  params: Promise<{ id: string }>;
}

const AdminClientDetailPage = async ({ params }: IPageProps) => {
  const session = await getSession();

  if (!session) redirect('/login');
  if (session.user.role !== 'ADMIN') redirect('/client');

  const { id } = await params;

  return (
    <AdminPageWrapper userName={session.user.name}>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Карточка проекта</h1>
        <p className="text-gray-600">Заказчик #{id}</p>
        <p className="text-gray-500 mt-4">Страница в разработке</p>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminClientDetailPage;
