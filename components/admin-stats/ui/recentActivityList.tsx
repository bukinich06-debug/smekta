import Link from 'next/link';
import type { IAdminStatsActivityItem } from '@/domain/stats';
import { formatDateTime } from '../helpers/formatDateTime';

interface IRecentActivityListProps {
  items: IAdminStatsActivityItem[];
}

export const RecentActivityList = ({ items }: IRecentActivityListProps) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Недавние изменения</h2>
    {items.length === 0 && <p className="text-gray-500 text-sm">Записей пока нет.</p>}
    {items.length > 0 && (
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm text-gray-900">{item.description}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDateTime(item.createdAt)} · {item.authorName}
              </p>
            </div>
            <Link
              href={`/admin/clients/${item.clientId}`}
              className="text-sm text-blue-600 hover:text-blue-800 shrink-0"
            >
              {item.projectLabel}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);
