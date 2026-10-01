'use client';

import { formatMoney } from '../helpers/formatMoney';

interface IExtraWorksTotalsProps {
  total: number;
  budgetTotal: number;
}

export const ExtraWorksTotals = ({ total, budgetTotal }: IExtraWorksTotalsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">Итого по допработам:</span>
        <span className="text-xl font-bold text-blue-600">{formatMoney(total)}</span>
      </div>
    </div>
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">Включено в общий бюджет:</span>
        <span className="text-xl font-bold text-green-700">{formatMoney(budgetTotal)}</span>
      </div>
    </div>
  </div>
);
