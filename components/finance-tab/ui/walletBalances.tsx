import type { IProjectFinanceSummary } from '@/domain/finance';
import { formatMoney } from '../helpers/formatMoney';

interface IWalletBalancesProps {
  summary: IProjectFinanceSummary;
}

export const WalletBalances = ({ summary }: IWalletBalancesProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
      <p className="text-sm text-blue-800 font-medium">Кошелёк «Работы»</p>
      <p className="text-2xl font-bold text-blue-900">{formatMoney(summary.worksWalletBalance)}</p>
    </div>
    <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
      <p className="text-sm text-emerald-800 font-medium">Кошелёк «Материалы»</p>
      <p className="text-2xl font-bold text-emerald-900">
        {formatMoney(summary.materialsWalletBalance)}
      </p>
    </div>
  </div>
);
