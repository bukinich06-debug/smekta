import type { IProjectFinanceSummary } from '@/domain/finance';
import { formatMoney } from '../helpers/formatMoney';

interface IWalletBalancesProps {
  summary: IProjectFinanceSummary;
}

const WalletCard = ({
  title,
  balance,
  tone,
}: {
  title: string;
  balance: number;
  tone: 'blue' | 'emerald';
}) => {
  const negative = balance < 0;
  const box =
    tone === 'blue'
      ? 'bg-blue-50 border-blue-100 text-blue-800'
      : 'bg-emerald-50 border-emerald-100 text-emerald-800';
  const amount =
    tone === 'blue'
      ? negative
        ? 'text-red-700'
        : 'text-blue-900'
      : negative
        ? 'text-red-700'
        : 'text-emerald-900';

  return (
    <div className={`rounded-lg border p-4 ${box}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className={`text-2xl font-bold ${amount}`}>{formatMoney(balance)}</p>
      {negative && (
        <p className="text-xs mt-1 text-red-700">Недостача учтена в «к доплате сейчас»</p>
      )}
    </div>
  );
};

export const WalletBalances = ({ summary }: IWalletBalancesProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    <WalletCard title="Кошелёк «Работы»" balance={summary.worksWalletBalance} tone="blue" />
    <WalletCard title="Кошелёк «Материалы»" balance={summary.materialsWalletBalance} tone="emerald" />
  </div>
);
