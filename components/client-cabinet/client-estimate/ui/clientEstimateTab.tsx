'use client';

import type { IClientProjectEstimate } from '@/domain/estimates';
import { formatMoney } from '../helpers/formatMoney';
import { ClientEstimateSection } from './clientEstimateSection';

interface IClientEstimateTabProps {
  data: IClientProjectEstimate;
}

export const ClientEstimateTab = ({ data }: IClientEstimateTabProps) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Смета проекта</h2>

    {data.sections.length === 0 && (
      <div className="text-center text-gray-500 py-12">
        <p>Пока нет позиций, доступных для просмотра.</p>
      </div>
    )}

    {data.sections.map((section) => (
      <ClientEstimateSection key={section.id} section={section} />
    ))}

    {data.sections.length > 0 && (
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Итого по смете:</span>
          <span className="text-2xl font-bold text-blue-600">{formatMoney(data.total)}</span>
        </div>
      </div>
    )}
  </div>
);
