'use client';

import type { IClientEstimateItem } from '@/domain/estimates';
import { formatMoney } from '../helpers/formatMoney';
import { getItemStatusLabel } from '../helpers/getItemStatusLabel';

interface IClientEstimateItemRowProps {
  item: IClientEstimateItem;
  index: number;
}

export const ClientEstimateItemRow = ({ item, index }: IClientEstimateItemRowProps) => {
  const total = parseFloat(item.quantity) * parseFloat(item.unitPrice);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-3 py-2 text-gray-700">{index}</td>
      <td className="px-3 py-2 text-gray-900">{item.name}</td>
      <td className="px-3 py-2 text-gray-700">{item.unit}</td>
      <td className="px-3 py-2 text-right text-gray-700">{item.quantity}</td>
      <td className="px-3 py-2 text-right text-gray-700">{formatMoney(parseFloat(item.unitPrice))}</td>
      <td className="px-3 py-2 text-right font-medium text-gray-900">{formatMoney(total)}</td>
      <td className="px-3 py-2 text-gray-600 text-xs">{item.comment || '—'}</td>
      <td className="px-3 py-2">
        <span
          className={`inline-block px-2 py-1 rounded text-xs ${
            item.status === 'AGREED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {getItemStatusLabel(item.status)}
        </span>
      </td>
    </tr>
  );
};
