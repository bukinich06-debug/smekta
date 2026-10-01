import { formatMoney } from '../helpers/formatMoney';

interface IReceiptsTotalsProps {
  totalDue: number;
  totalPaid: number;
  totalRemainder: number;
}

export const ReceiptsTotals = ({ totalDue, totalPaid, totalRemainder }: IReceiptsTotalsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-500">К оплате</p>
      <p className="text-xl font-bold text-gray-900">{formatMoney(totalDue)}</p>
    </div>
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <p className="text-sm text-gray-500">Оплачено</p>
      <p className="text-xl font-bold text-green-700">{formatMoney(totalPaid)}</p>
    </div>
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-sm text-gray-500">Остаток</p>
      <p className="text-xl font-bold text-red-700">{formatMoney(totalRemainder)}</p>
    </div>
  </div>
);
