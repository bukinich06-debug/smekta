'use client';

import type { IClientCardDetails } from '@/domain/clients';
import type { IAdminUser } from '@/services/users/listAdmins';
import { useCardEdit } from '../hooks/useCardEdit';
import { CardHeader } from './cardHeader';
import { CardEditForm } from './cardEditForm';
import { CardTabs } from './cardTabs';
import Link from 'next/link';

interface IClientCardProps {
  data: IClientCardDetails;
  admins: IAdminUser[];
}

export const ClientCard = ({ data, admins }: IClientCardProps) => {
  if (!data.project) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">У заказчика нет проектов</p>
      </div>
    );
  }

  const managerName = admins.find((a) => a.id === data.project!.managerId)?.name || 'Не указан';

  const {
    isEditing,
    formData,
    loading,
    error,
    success,
    updateField,
    startEdit,
    cancelEdit,
    save,
  } = useCardEdit({
    clientId: data.id,
    projectId: data.project.id,
    initialData: {
      fullName: data.fullName,
      phone: data.phone || '',
      email: data.email || '',
      projectName: data.project.name,
      address: data.project.address,
      projectStatus: data.project.status,
      startDate: data.project.startDate,
      managerId: data.project.managerId,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <nav className="text-sm text-gray-500">
          <Link href="/admin/clients" className="hover:text-gray-700">
            Заказчики
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{data.fullName}</span>
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
        <CardHeader data={data} managerName={managerName} />
      )}

      <CardTabs />
    </div>
  );
};
