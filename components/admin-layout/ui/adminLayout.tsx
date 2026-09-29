'use client';

import Link from 'next/link';
import { useAdminNav } from '../hooks/useAdminNav';
import type { ReactNode } from 'react';

interface IAdminLayoutProps {
  children: ReactNode;
  userName: string;
  onLogout: () => void;
}

export const AdminLayout = ({ children, userName, onLogout }: IAdminLayoutProps) => {
  const { items, isActive } = useAdminNav();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-semibold text-gray-900">Смета</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{userName}</span>
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="sm:hidden bg-white border-b border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
