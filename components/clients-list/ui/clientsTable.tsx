'use client';

import Link from 'next/link';
import type { IClientListItem } from '@/domain/clients';
import { formatMoney } from '../helpers/formatMoney';
import { formatDate } from '../helpers/formatDate';
import { getStatusLabel } from '../helpers/getStatusLabel';

interface IClientsTableProps {
  items: IClientListItem[];
}

export const ClientsTable = ({ items }: IClientsTableProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">Заказчики не найдены</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ФИО
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Адрес
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Смета работ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Поступило
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Освоено
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Остаток
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                К доплате
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата начала
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Обновлено
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/clients/${item.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {item.fullName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.address || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getStatusLabel(item.projectStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(item.estimateTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(item.receivedTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(item.masteredTotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatMoney(item.balanceOnHand)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={item.dueNow > 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    {formatMoney(item.dueNow)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
