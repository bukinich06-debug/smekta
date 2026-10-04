import type { IAdminStatsKpi } from '@/domain/stats';
import { formatMoney } from '../helpers/formatMoney';

interface IStatsKpiGridProps {
  kpi: IAdminStatsKpi;
}

export const StatsKpiGrid = ({ kpi }: IStatsKpiGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Всего проектов</p>
      <p className="text-2xl font-semibold text-gray-900">{kpi.totalProjects}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Активные</p>
      <p className="text-2xl font-semibold text-blue-700">{kpi.activeProjects}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Завершённые</p>
      <p className="text-2xl font-semibold text-gray-900">{kpi.completedProjects}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Сумма смет работ</p>
      <p className="text-2xl font-semibold text-gray-900">{formatMoney(kpi.estimateTotal)}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">
        Поступило от заказчиков{kpi.periodAppliedToMoney ? ' (за период)' : ''}
      </p>
      <p className="text-2xl font-semibold text-green-700">{formatMoney(kpi.receivedTotal)}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Освоено{kpi.periodAppliedToMoney ? ' (за период)' : ''}</p>
      <p className="text-2xl font-semibold text-gray-900">{formatMoney(kpi.masteredTotal)}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Остаток на руках у подрядчика</p>
      <p className="text-2xl font-semibold text-blue-700">{formatMoney(kpi.balanceOnHand)}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">К доплате сейчас</p>
      <p className="text-2xl font-semibold text-red-600">{formatMoney(kpi.dueNow)}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Неоплаченные и частично оплаченные чеки</p>
      <p className="text-2xl font-semibold text-amber-700">{kpi.unpaidReceiptsCount}</p>
    </div>
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2 xl:col-span-1">
      <p className="text-sm text-gray-500">
        Объём выполненных допработ{kpi.periodAppliedToMoney ? ' (за период)' : ''}
      </p>
      <p className="text-2xl font-semibold text-gray-900">{formatMoney(kpi.completedExtraWorksVolume)}</p>
    </div>
  </div>
);
