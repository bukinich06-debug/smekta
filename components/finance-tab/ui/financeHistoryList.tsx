import type { IFinanceHistoryItem } from '@/domain/finance';
import { formatDateTime } from '../helpers/formatDateTime';

interface IFinanceHistoryListProps {
  items: IFinanceHistoryItem[];
}

export const FinanceHistoryList = ({ items }: IFinanceHistoryListProps) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">История изменений по деньгам пока пуста.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-3 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <span className="font-medium text-gray-900">{item.label}</span>
            <span className="text-gray-500">{formatDateTime(item.createdAt)}</span>
          </div>
          <p className="text-gray-700 mt-1">{item.detail}</p>
          <p className="text-gray-500 text-xs mt-1">{item.authorName}</p>
        </li>
      ))}
    </ul>
  );
};
