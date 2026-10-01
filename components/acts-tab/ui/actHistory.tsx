'use client';

import type { IActStatusHistoryItem } from '@/domain/acts';
import { formatDate } from '../helpers/formatDate';
import { ActStatusBadge } from './actStatusBadge';

interface IActHistoryProps {
  items: IActStatusHistoryItem[];
  loading: boolean;
}

export const ActHistory = ({ items, loading }: IActHistoryProps) => {
  if (loading) return <p className="text-sm text-gray-500">Загрузка истории…</p>;

  if (items.length === 0) return <p className="text-sm text-gray-500">История подписания пока пуста.</p>;

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="text-sm text-gray-700 flex flex-wrap items-center gap-2">
          <span className="text-gray-500">{formatDate(item.createdAt)}</span>
          <span>{item.authorName}</span>
          {item.previousStatus && (
            <>
              <ActStatusBadge status={item.previousStatus} />
              <span>→</span>
            </>
          )}
          <ActStatusBadge status={item.status} />
        </li>
      ))}
    </ul>
  );
};
