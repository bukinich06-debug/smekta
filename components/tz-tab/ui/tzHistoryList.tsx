import type { IProjectTzHistoryItem } from '@/domain/project-tz';
import { formatDateTime } from '../helpers/formatDateTime';

interface ITzHistoryListProps {
  items: IProjectTzHistoryItem[];
}

export const TzHistoryList = ({ items }: ITzHistoryListProps) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Изменений пока нет.</p>;
  }

  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-3 text-sm text-gray-700 flex flex-wrap gap-x-2">
          <span>{formatDateTime(item.createdAt)}</span>
          <span className="text-gray-400">·</span>
          <span>{item.authorName}</span>
        </li>
      ))}
    </ul>
  );
};
