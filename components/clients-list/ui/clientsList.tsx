'use client';

import Link from 'next/link';
import type { IClientListItem } from '@/domain/clients';
import { ClientsFilters } from './clientsFilters';
import { ClientsTable } from './clientsTable';

interface IClientsListProps {
  items: IClientListItem[];
}

export const ClientsList = ({ items }: IClientsListProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Заказчики</h1>
        <Link
          href="/admin/clients/create"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Создать заказчика
        </Link>
      </div>

      <ClientsFilters />
      <ClientsTable items={items} />
    </div>
  );
};
