import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Заказчик не найден</h2>
        <p className="text-gray-600 mb-8">
          Заказчик с указанным ID не существует или был удалён
        </p>
        <Link
          href="/admin/clients"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Вернуться к списку заказчиков
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
