'use client';

import type { IClientEstimateSectionWithItems } from '@/domain/estimates';
import { formatMoney } from '../helpers/formatMoney';
import { ClientEstimateItemRow } from './clientEstimateItemRow';

interface IClientEstimateSectionProps {
  section: IClientEstimateSectionWithItems;
}

export const ClientEstimateSection = ({ section }: IClientEstimateSectionProps) => (
  <div className="bg-white border border-gray-200 rounded-lg mb-6">
    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
      <span className="text-sm text-gray-900 font-medium">Итого: {formatMoney(section.total)}</span>
    </div>

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
  </div>
);
