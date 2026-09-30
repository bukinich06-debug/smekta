'use client';

import type { IAuthSession } from '@/domain/auth';
import type { IClientInviteInfo } from '@/domain/clients';
import Link from 'next/link';
import { useInviteAccept } from '../hooks/useInviteAccept';

interface IInvitePageProps {
  token: string;
  session: IAuthSession | null;
  client: IClientInviteInfo | null;
}

export const InvitePage = ({ token, session, client }: IInvitePageProps) => {
  const { loading, error, accept } = useInviteAccept({ token });

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Ссылка недействительна
          </h1>
          <p className="text-gray-600 text-center">
            Ссылка недействительна или уже использована. Обратитесь к подрядчику.
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    const callbackUrl = encodeURIComponent(`/invite/${token}`);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Следите за сметой и ходом ремонта
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Чтобы следить за сметой и ходом ремонта, зарегистрируйтесь или войдите
          </p>
          <div className="space-y-3">
            <Link
              href={`/register?callback=${callbackUrl}`}
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Регистрация
            </Link>
            <Link
              href={`/login?callback=${callbackUrl}`}
              className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Вход
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (session.user.role === 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Ссылка для заказчика
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Эта ссылка предназначена для заказчика
          </p>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Информация о проекте:</p>
            {client.projectNumber && (
              <p className="text-sm"><span className="font-medium">Номер проекта:</span> {client.projectNumber}</p>
            )}
            {client.projectName && (
              <p className="text-sm"><span className="font-medium">Название:</span> {client.projectName}</p>
            )}
            {client.projectAddress && (
              <p className="text-sm"><span className="font-medium">Адрес:</span> {client.projectAddress}</p>
            )}
          </div>
          <p className="text-sm text-green-600 text-center">Ссылка активна</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Подключение к проекту
        </h1>
        
        <div className="bg-blue-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Вас приглашают следить за проектом:</p>
          {client.projectNumber && (
            <p className="text-sm mb-1"><span className="font-medium">Номер:</span> {client.projectNumber}</p>
          )}
          {client.projectName && (
            <p className="text-sm mb-1"><span className="font-medium">Название:</span> {client.projectName}</p>
          )}
          {client.projectAddress && (
            <p className="text-sm"><span className="font-medium">Адрес:</span> {client.projectAddress}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={accept}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Подключение...' : 'Подписаться'}
        </button>
      </div>
    </div>
  );
};
