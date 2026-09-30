'use client';

import type { ReactNode } from 'react';
import { useClientLogout } from '../hooks/useClientLogout';

interface IClientCabinetShellProps {
  userName: string;
  children: ReactNode;
}

export const ClientCabinetShell = ({ userName, children }: IClientCabinetShellProps) => {
  const { handleLogout } = useClientLogout();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Личный кабинет</p>
            <p className="text-sm text-gray-500">{userName}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Выйти
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
