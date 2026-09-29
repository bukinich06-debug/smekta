'use client';

import type { IAuthUser } from '@/domain/auth';
import { useLogout } from '../hooks/useLogout';

interface IUserInfoProps {
  user: IAuthUser;
}

export const UserInfo = ({ user }: IUserInfoProps) => {
  const { isLoading, handleLogout } = useLogout();

  const roleText = user.role === 'ADMIN' ? 'Администратор' : 'Клиент';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Добро пожаловать!
          </h2>
        </div>
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600">Имя</p>
            <p className="text-lg font-medium text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Роль</p>
            <p className="text-lg font-medium text-gray-900">{roleText}</p>
          </div>
          <div className="pt-4">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Выход...' : 'Выйти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
