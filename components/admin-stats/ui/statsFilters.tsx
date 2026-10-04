'use client';

import type { ProjectStatus } from '@prisma/client';
import { useStatsFilters } from '../hooks/useStatsFilters';

export const StatsFilters = () => {
  const { filters, updateFilters } = useStatsFilters();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateFilters({ status: value ? (value as ProjectStatus) : undefined });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ dateFrom: e.target.value || undefined });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ dateTo: e.target.value || undefined });
  };

  const handleReset = () => {
    updateFilters({ status: undefined, dateFrom: undefined, dateTo: undefined });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        <div className="w-full lg:w-48">
          <label htmlFor="stats-status" className="block text-sm font-medium text-gray-700 mb-1">
            Статус проекта
          </label>
          <select
            id="stats-status"
            value={filters.status || ''}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все статусы</option>
            <option value="PLANNING">Планирование</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="PAUSED">Приостановлен</option>
            <option value="COMPLETED">Завершён</option>
          </select>
        </div>
        <div className="w-full lg:w-44">
          <label htmlFor="stats-date-from" className="block text-sm font-medium text-gray-700 mb-1">
            Период с
          </label>
          <input
            type="date"
            id="stats-date-from"
            value={filters.dateFrom || ''}
            onChange={handleDateFromChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full lg:w-44">
          <label htmlFor="stats-date-to" className="block text-sm font-medium text-gray-700 mb-1">
            Период по
          </label>
          <input
            type="date"
            id="stats-date-to"
            value={filters.dateTo || ''}
            onChange={handleDateToChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Сбросить
        </button>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Период влияет на «Поступило» и «Освоено» (по датам поступлений, подписанных актов, оплат по чекам и
        выполненных допработ). Остальные показатели — на текущий момент по отфильтрованным проектам.
      </p>
    </div>
  );
};
