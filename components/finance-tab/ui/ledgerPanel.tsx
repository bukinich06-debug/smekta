import type { IFinanceDueExtraWork, IFinanceLedgerRow } from '@/domain/finance';
import { formatDate } from '../helpers/formatDate';
import { formatMoney } from '../helpers/formatMoney';

interface ILedgerPanelProps {
  ledger: IFinanceLedgerRow[];
  dueExtraWorks: IFinanceDueExtraWork[];
}

export const LedgerPanel = ({ ledger, dueExtraWorks }: ILedgerPanelProps) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-3">Сальдовая ведомость</h3>
    {ledger.length === 0 ? (
      <p className="text-sm text-gray-500">Движений пока нет.</p>
    ) : (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-gray-500 font-medium">Дата</th>
              <th className="px-3 py-2 text-left text-gray-500 font-medium">Операция</th>
              <th className="px-3 py-2 text-right text-gray-500 font-medium">Сумма</th>
              <th className="px-3 py-2 text-right text-gray-500 font-medium">Остаток</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ledger.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 whitespace-nowrap">{formatDate(row.date)}</td>
                <td className="px-3 py-2">{row.label}</td>
                <td
                  className={`px-3 py-2 text-right whitespace-nowrap ${
                    row.kind === 'payment_direct'
                      ? 'text-gray-600'
                      : row.amount >= 0
                        ? 'text-green-700'
                        : 'text-red-600'
                  }`}
                >
                  {row.kind === 'payment_direct' ? (
                    <span title="Не влияет на остаток кошельков">0 (прямая)</span>
                  ) : (
                    <>
                      {row.amount >= 0 ? '+' : ''}
                      {formatMoney(row.amount)}
                    </>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
                  {formatMoney(row.balanceAfter)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {dueExtraWorks.length > 0 && (
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">К доплате (допработы без бюджета)</h4>
        <ul className="space-y-2">
          {dueExtraWorks.map((row) => (
            <li
              key={row.id}
              className="flex justify-between text-sm border border-amber-200 bg-amber-50 rounded px-3 py-2"
            >
              <span>
                {formatDate(row.date)} — {row.description}
              </span>
              <span className="font-medium text-red-700">−{formatMoney(row.amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
