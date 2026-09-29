'use client';

import { useState } from 'react';
import { useClientsFilters } from '../hooks/useClientsFilters';
import type { ProjectStatus } from '@prisma/client';

export const ClientsFilters = () => {
  const { filters, updateFilters } = useClientsFilters();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput || undefined });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    updateFilters({ status: value ? (value as ProjectStatus) : undefined });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Поиск
          </label>
          <input
            type="text"
            id="search"
            placeholder="Поиск по ФИО, адресу, номеру проекта..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full sm:w-48">
          <label htmlFor="status" className="sr-only">
            Статус
          </label>
          <select
            id="status"
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
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Найти
        </button>
      </form>
    </div>
  );
};
