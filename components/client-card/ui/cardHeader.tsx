'use client';

import type { IClientCardDetails, IProjectManager } from '@/domain/clients';
import { formatDate } from '../helpers/formatDate';
import { ProjectStatusBadge } from '@/components/project-status-badge';
import { CardHeaderSection, CardHeaderField } from './cardHeaderSection';
import { CardHeaderBudget } from './cardHeaderBudget';

type ICardHeaderRole = 'admin' | 'client';

interface IBudgetData {
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  stillNeededForWorks: number;
}

interface ICardHeaderProps {
  data: IClientCardDetails;
  role: ICardHeaderRole;
  managerName?: string;
  budgetData?: IBudgetData | null;
  budgetLoading?: boolean;
  budgetError?: string | null;
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

export const CardHeader = ({
  data,
  role,
  managerName,
  budgetData: externalBudgetData,
  budgetLoading = false,
  budgetError = null,
}: ICardHeaderProps) => {
  if (!data.project) return null;

  const hasServerFinanceData = data.estimateTotal !== null;

  const financeData = hasServerFinanceData
    ? {
        estimateTotal: data.estimateTotal ?? 0,
        receivedTotal: data.receivedTotal ?? 0,
        masteredTotal: data.masteredTotal ?? 0,
        balanceOnHand: data.balanceOnHand ?? 0,
        dueNow: data.dueNow ?? 0,
        stillNeededForWorks: data.stillNeededForWorks ?? 0,
      }
    : externalBudgetData;

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ObjectBlock data={data} />
        {role === 'client' && <ForemanBlock manager={data.manager} />}
        {role === 'admin' && <CustomerBlock data={data} />}
        <CardHeaderBudget
          estimateTotal={financeData?.estimateTotal ?? 0}
          receivedTotal={financeData?.receivedTotal ?? 0}
          masteredTotal={financeData?.masteredTotal ?? 0}
          balanceOnHand={financeData?.balanceOnHand ?? 0}
          dueNow={financeData?.dueNow ?? 0}
          stillNeededForWorks={financeData?.stillNeededForWorks ?? 0}
          loading={!hasServerFinanceData && budgetLoading}
          error={!hasServerFinanceData ? budgetError : null}
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
