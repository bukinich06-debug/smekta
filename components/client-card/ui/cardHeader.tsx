'use client';

import type { IClientCardDetails, IProjectManager } from '@/domain/clients';
import { formatDate } from '../helpers/formatDate';
import { ProjectStatusBadge } from '@/components/project-status-badge';
import { CardHeaderSection, CardHeaderField } from './cardHeaderSection';
import { CardHeaderBudget } from './cardHeaderBudget';

type ICardHeaderRole = 'admin' | 'client';

interface ICardHeaderProps {
  data: IClientCardDetails;
  role: ICardHeaderRole;
  managerName?: string;
}

const ForemanBlock = ({ manager }: { manager: IProjectManager | null }) => (
  <CardHeaderSection title="Прораб">
    {manager ? (
      <div className="space-y-3">
        <CardHeaderField label="ФИО">{manager.name}</CardHeaderField>
        {manager.phone && <CardHeaderField label="Телефон">{manager.phone}</CardHeaderField>}
        <CardHeaderField label="E-mail">{manager.email}</CardHeaderField>
      </div>
    ) : (
      <p className="text-gray-600">Прораб не назначен</p>
    )}
  </CardHeaderSection>
);

const CustomerBlock = ({ data }: { data: IClientCardDetails }) => (
  <CardHeaderSection title="Заказчик">
    <div className="space-y-3">
      <CardHeaderField label="ФИО">{data.fullName}</CardHeaderField>
      <CardHeaderField label="Телефон">{data.phone || '—'}</CardHeaderField>
      <CardHeaderField label="E-mail">{data.email || '—'}</CardHeaderField>
    </div>
  </CardHeaderSection>
);

const ObjectBlock = ({ data }: { data: IClientCardDetails }) => {
  if (!data.project) return null;

  return (
    <CardHeaderSection title="Объект">
      <div className="space-y-3">
        <CardHeaderField label="Название проекта">{data.project.name}</CardHeaderField>
        <CardHeaderField label="Адрес объекта">{data.project.address}</CardHeaderField>
        <CardHeaderField label="Статус проекта">
          <ProjectStatusBadge status={data.project.status} />
        </CardHeaderField>
        <CardHeaderField label="Дата старта">{formatDate(data.project.startDate)}</CardHeaderField>
      </div>
    </CardHeaderSection>
  );
};

export const CardHeader = ({ data, role, managerName }: ICardHeaderProps) => {
  if (!data.project) return null;

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ObjectBlock data={data} />
        {role === 'client' && <ForemanBlock manager={data.manager} />}
        {role === 'admin' && <CustomerBlock data={data} />}
        <CardHeaderBudget
          estimateTotal={data.estimateTotal}
          receivedTotal={data.receivedTotal}
          masteredTotal={data.masteredTotal}
          balanceOnHand={data.balanceOnHand}
          dueNow={data.dueNow}
          stillNeededForWorks={data.stillNeededForWorks}
        />
      </div>
      {role === 'admin' && managerName && (
        <p className="text-sm text-gray-500 px-1">
          Ответственный: <span className="text-gray-800 font-medium">{managerName}</span>
        </p>
      )}
    </div>
  );
};
