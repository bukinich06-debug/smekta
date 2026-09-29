'use client';

import type { IUpdateClientCardInput } from '@/domain/clients';
import type { ProjectStatus } from '@prisma/client';
import type { IAdminUser } from '@/services/users/listAdmins';

interface ICardEditFormProps {
  formData: IUpdateClientCardInput;
  updateField: <K extends keyof IUpdateClientCardInput>(
    field: K,
    value: IUpdateClientCardInput[K]
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
  admins: IAdminUser[];
}

export const CardEditForm = ({
  formData,
  updateField,
  onSave,
  onCancel,
  loading,
  error,
  admins,
}: ICardEditFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Редактирование карточки</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              ФИО *
            </label>
            <input
              type="text"
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон *
            </label>
            <input
              type="tel"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Адрес объекта *
            </label>
            <input
              type="text"
              id="address"
              required
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Название проекта *
            </label>
            <input
              type="text"
              id="projectName"
              required
              value={formData.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Статус проекта *
            </label>
            <select
              id="projectStatus"
              required
              value={formData.projectStatus}
              onChange={(e) => updateField('projectStatus', e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PLANNING">Планирование</option>
              <option value="IN_PROGRESS">В работе</option>
              <option value="PAUSED">Приостановлен</option>
              <option value="COMPLETED">Завершён</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Дата начала проекта
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
              onChange={(e) =>
                updateField('startDate', e.target.value ? new Date(e.target.value) : null)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
              Ответственный администратор *
            </label>
            <select
              id="managerId"
              required
              value={formData.managerId}
              onChange={(e) => updateField('managerId', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите администратора</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};
