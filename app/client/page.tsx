import { redirect } from 'next/navigation';
import { getSession } from '@/services/auth/getSession';

const ClientPage = async () => {
  const session = await getSession();

  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Личный кабинет</h1>
        <p className="text-gray-600 mb-6">Добро пожаловать, {session.user.name}</p>
        <p className="text-gray-500">Личный кабинет заказчика в разработке</p>
        <a
          href="/login"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Выйти
        </a>
      </div>
    </div>
  );
};

export default ClientPage;
