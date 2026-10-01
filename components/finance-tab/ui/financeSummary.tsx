import type { IProjectFinanceSummary } from '@/domain/finance';
import { formatMoney } from '../helpers/formatMoney';

interface IFinanceSummaryProps {
  summary: IProjectFinanceSummary;
  showStillNeeded?: boolean;
}

export const FinanceSummary = ({ summary, showStillNeeded }: IFinanceSummaryProps) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Бюджет проекта</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Смета работ</p>
        <p className="text-xl font-semibold text-gray-900">{formatMoney(summary.estimateTotal)}</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Поступило</p>
        <p className="text-xl font-semibold text-green-700">{formatMoney(summary.receivedTotal)}</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Освоено</p>
        <p className="text-xl font-semibold text-gray-900">{formatMoney(summary.masteredTotal)}</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">Остаток на руках</p>
        <p className="text-xl font-semibold text-blue-700">{formatMoney(summary.balanceOnHand)}</p>
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-sm text-gray-500">К доплате сейчас</p>
        <p className="text-xl font-semibold text-red-600">{formatMoney(summary.dueNow)}</p>
      </div>
      {showStillNeeded && (
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Нужно ещё до конца сметы (работы)</p>
          <p className="text-xl font-semibold text-amber-700">
            {formatMoney(summary.stillNeededForWorks)}
          </p>
        </div>
      )}
    </div>
  </div>
);
