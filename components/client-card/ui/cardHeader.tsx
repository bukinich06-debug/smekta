'use client';

import type { IClientCardDetails } from '@/domain/clients';
import { formatMoney } from '../helpers/formatMoney';
import { formatDate } from '../helpers/formatDate';
import { ProjectStatusBadge } from '@/components/project-status-badge';

interface ICardHeaderProps {
  data: IClientCardDetails;
  managerName?: string;
  showProjectName?: boolean;
}

export const CardHeader = ({ data, managerName, showProjectName }: ICardHeaderProps) => {
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
        {showProjectName && (
          <div>
            <p className="text-sm text-gray-500">Название проекта</p>
            <p className="text-lg font-semibold text-gray-900">{data.project.name}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Статус проекта</p>
          <div className="mt-1">
            <ProjectStatusBadge status={data.project.status} />
          </div>
        </div>
        {managerName !== undefined && (
          <div>
            <p className="text-sm text-gray-500">Ответственный администратор</p>
            <p className="text-lg font-semibold text-gray-900">{managerName}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Дата старта</p>
          <p className="text-lg font-semibold text-gray-900">{formatDate(data.project.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Смета работ</p>
          <p className="text-lg font-semibold text-gray-900">{formatMoney(data.estimateTotal)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Поступило</p>
          <p className="text-lg font-semibold text-green-600">{formatMoney(data.receivedTotal)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Освоено</p>
          <p className="text-lg font-semibold text-gray-900">{formatMoney(data.masteredTotal)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Остаток на руках</p>
          <p className="text-lg font-semibold text-blue-700">{formatMoney(data.balanceOnHand)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">К доплате сейчас</p>
          <p className="text-lg font-semibold text-red-600">{formatMoney(data.dueNow)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Нужно ещё до конца сметы (работы)</p>
          <p className="text-lg font-semibold text-amber-700">
            {formatMoney(data.stillNeededForWorks)}
          </p>
        </div>
      </div>
    </div>
  );
};
