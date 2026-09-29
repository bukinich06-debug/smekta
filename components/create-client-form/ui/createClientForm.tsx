'use client';

import Link from 'next/link';
import { useCreateClient } from '../hooks/useCreateClient';
import type { ProjectStatus } from '@prisma/client';

export const CreateClientForm = () => {
  const { formData, updateField, submit, loading, error } = useCreateClient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Создать заказчика</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            ФИО *
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Адрес объекта *
          </label>
          <input
            type="text"
            id="address"
            required
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
            Название проекта *
          </label>
          <input
            type="text"
            id="projectName"
            required
            value={formData.projectName}
            onChange={(e) => updateField('projectName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Статус проекта *
          </label>
          <select
            id="projectStatus"
            required
            value={formData.projectStatus}
            onChange={(e) => updateField('projectStatus', e.target.value as ProjectStatus)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PLANNING">Планирование</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="PAUSED">Приостановлен</option>
            <option value="COMPLETED">Завершён</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Дата начала проекта
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              updateField('startDate', e.target.value ? new Date(e.target.value) : null)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Создание...' : 'Создать'}
          </button>
          <Link
            href="/admin/clients"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
};
