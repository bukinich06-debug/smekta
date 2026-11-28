'use client';

import type { IClientEstimateSectionWithItems } from '@/domain/estimates';
import { formatMoney } from '../helpers/formatMoney';
import { ClientEstimateItemRow } from './clientEstimateItemRow';

interface IClientEstimateSectionProps {
  section: IClientEstimateSectionWithItems;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ClientEstimateSection = ({ 
  section, 
  isCollapsed, 
  onToggleCollapse 
}: IClientEstimateSectionProps) => (
  <div className="bg-white border border-gray-200 rounded-lg mb-6">
    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleCollapse}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={isCollapsed ? 'Развернуть раздел' : 'Свернуть раздел'}
          aria-expanded={!isCollapsed}
        >
          <span className={`inline-block transition-transform ${isCollapsed ? '' : 'rotate-90'}`}>▸</span>
        </button>
        <h3 
          className="text-lg font-semibold text-gray-900 cursor-pointer select-none"
          onClick={onToggleCollapse}
        >
          {section.name}
        </h3>
      </div>
      <span className="text-sm text-gray-900 font-medium">Итого: {formatMoney(section.total)}</span>
    </div>

    {!isCollapsed && (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-12">№</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Наименование</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-24">Ед. изм.</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-24">Кол-во</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-32">Цена</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-32">Сумма</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Комментарий</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-32">Статус</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((item, index) => (
              <ClientEstimateItemRow key={item.id} item={item} index={index + 1} />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
