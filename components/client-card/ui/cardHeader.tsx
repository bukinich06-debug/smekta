'use client';

import type { IClientCardDetails } from '@/domain/clients';
import { formatMoney } from '../helpers/formatMoney';
import { formatDate } from '../helpers/formatDate';
import { getStatusLabel } from '../helpers/getStatusLabel';

interface ICardHeaderProps {
  data: IClientCardDetails;
  managerName: string;
}

export const CardHeader = ({ data, managerName }: ICardHeaderProps) => {
  if (!data.project) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">ФИО</p>
          <p className="text-lg font-semibold text-gray-900">{data.fullName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Адрес объекта</p>
          <p className="text-lg font-semibold text-gray-900">{data.project.address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Телефон</p>
          <p className="text-lg font-semibold text-gray-900">{data.phone || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">E-mail</p>
          <p className="text-lg font-semibold text-gray-900">{data.email || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Статус проекта</p>
          <p className="text-lg font-semibold text-gray-900">
            {getStatusLabel(data.project.status)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ответственный администратор</p>
          <p className="text-lg font-semibold text-gray-900">{managerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Дата старта</p>
          <p className="text-lg font-semibold text-gray-900">{formatDate(data.project.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Общая сумма сметы</p>
          <p className="text-lg font-semibold text-gray-900">{formatMoney(data.estimateTotal)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Оплачено</p>
          <p className="text-lg font-semibold text-green-600">{formatMoney(data.paid)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Остаток к оплате</p>
          <p className="text-lg font-semibold text-red-600">{formatMoney(data.debt)}</p>
        </div>
      </div>
    </div>
  );
};
