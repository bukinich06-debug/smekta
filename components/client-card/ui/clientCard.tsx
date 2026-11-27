'use client';

import type { IClientCardDetails } from '@/domain/clients';
import type { IAdminUser } from '@/services/users/listAdmins';
import { useCardEdit } from '../hooks/useCardEdit';
import { CardHeader } from './cardHeader';
import { CardEditForm } from './cardEditForm';
import { CardTabs } from './cardTabs';
import { ClientInvite } from '../client-invite';
import { BudgetRefetchProvider } from '../context/budgetRefetchContext';
import { useBudgetData } from '../hooks/useBudgetData';
import Link from 'next/link';

interface IClientCardProps {
  data: IClientCardDetails;
  admins: IAdminUser[];
}

export const ClientCard = ({ data, admins }: IClientCardProps) => {
  const hasServerFinanceData = data.estimateTotal !== null;
  const {
    data: budgetData,
    loading: budgetLoading,
    error: budgetError,
    refetch: refetchBudget,
  } = useBudgetData(hasServerFinanceData ? null : (data.project?.id || null));

  const {
    isEditing,
    formData,
    savedData,
    loading,
    error,
    success,
    updateField,
    startEdit,
    cancelEdit,
    save,
  } = useCardEdit({
    clientId: data.id,
    projectId: data.project?.id || 0,
    initialData: {
      fullName: data.fullName,
      phone: data.phone || '',
      email: data.email || '',
      projectName: data.project?.name || '',
      address: data.project?.address || '',
      projectStatus: data.project?.status || 'PLANNING',
      startDate: data.project?.startDate || null,
      managerId: data.project?.managerId || 0,
    },
    onSuccess: refetchBudget,
  });

  if (!data.project) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">У заказчика нет проектов</p>
      </div>
    );
  }

  const displayData = {
    ...data,
    fullName: savedData.fullName,
    phone: savedData.phone || null,
    email: savedData.email || null,
    project: data.project
      ? {
          ...data.project,
          name: savedData.projectName,
          address: savedData.address,
          status: savedData.projectStatus,
          startDate: savedData.startDate,
          managerId: savedData.managerId,
        }
      : null,
  };

  const managerName = admins.find((a) => a.id === displayData.project!.managerId)?.name || 'Не указан';

  return (
    <BudgetRefetchProvider refetch={refetchBudget}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <nav className="text-sm text-gray-500">
            <Link href="/admin/clients" className="hover:text-gray-700">
              Заказчики
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{displayData.fullName}</span>
          </nav>
          {!isEditing && (
            <button
              onClick={startEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Редактировать
            </button>
          )}
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Изменения успешно сохранены
          </div>
        )}

        {isEditing ? (
          <CardEditForm
            formData={formData}
            updateField={updateField}
            onSave={save}
            onCancel={cancelEdit}
            loading={loading}
            error={error}
            admins={admins}
          />
        ) : (
          <CardHeader
            data={displayData}
            role="admin"
            managerName={managerName}
            budgetData={budgetData}
            budgetLoading={budgetLoading}
            budgetError={budgetError}
          />
        )}

        <ClientInvite
          clientId={data.id}
          hasInviteToken={!!data.inviteToken}
          userId={data.userId}
          userEmail={data.userEmail}
        />

        <CardTabs projectId={data.project.id} />
      </div>
    </BudgetRefetchProvider>
  );
};
