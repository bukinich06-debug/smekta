'use client';

import { useEffect, useState } from 'react';
import type { IActLineItem, IActStatusHistoryItem } from '@/domain/acts';
import { getActStatusLabel } from '@/domain/acts';
import type { ActStatus } from '@prisma/client';
import { listActStatusHistory } from '@/services/acts/listActStatusHistory';
import { formatDate } from '../helpers/formatDate';
import { formatMoney } from '../helpers/formatMoney';
import { ActStatusBadge } from './actStatusBadge';
import { ActHistory } from './actHistory';
import { ActAttachments } from '../act-attachments';

interface IActRowData {
  id: number;
  number: string;
  date: Date;
  stage: string | null;
  status: ActStatus;
  comment: string | null;
  items: IActLineItem[];
  totalAmount: number;
}

interface IActRowProps {
  act: IActRowData;
  loading: boolean;
  readOnly?: boolean;
  onEdit: (act: IActRowData) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ActStatus) => void;
}

export const ActRow = ({
  act,
  loading,
  readOnly,
  onEdit,
  onDelete,
  onStatusChange,
}: IActRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<IActStatusHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!expanded || readOnly) return;

    let cancelled = false;

    const load = async () => {
      setHistoryLoading(true);
      try {
        const rows = await listActStatusHistory(act.id);
        if (!cancelled) setHistory(rows);
      } catch (err) {
        console.error('Ошибка загрузки истории акта:', err);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [expanded, readOnly, act.id]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">Акт №{act.number}</span>
            <span className="text-sm text-gray-500">{formatDate(act.date)}</span>
            <ActStatusBadge status={act.status} />
          </div>
          {act.stage && <p className="text-sm text-gray-700">Этап: {act.stage}</p>}
          {act.comment && (
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{act.comment}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-gray-900">{formatMoney(act.totalAmount)}</p>
        </div>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <label className="text-sm text-gray-600" htmlFor={`act-status-${act.id}`}>
            Статус:
          </label>
          <select
            id={`act-status-${act.id}`}
            value={act.status}
            disabled={loading}
            onChange={(e) => onStatusChange(act.id, e.target.value as ActStatus)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="DRAFT">{getActStatusLabel('DRAFT')}</option>
            <option value="SENT">{getActStatusLabel('SENT')}</option>
            <option value="SIGNED">{getActStatusLabel('SIGNED')}</option>
          </select>
          <button
            type="button"
            disabled={loading}
            onClick={() => onEdit(act)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Редактировать
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (window.confirm(`Удалить акт №${act.number}?`)) onDelete(act.id);
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Удалить
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm text-blue-600 hover:text-blue-800"
      >
        {expanded ? 'Скрыть позиции' : 'Показать позиции'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">Включённые позиции</p>
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-md">
              {act.items.map((item) => (
                <li key={item.id} className="px-3 py-2 text-sm flex justify-between gap-2">
                  <span>
                    <span className="text-gray-500">{item.sectionName}: </span>
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                  <span className="font-medium shrink-0">{formatMoney(item.amount)}</span>
                </li>
              ))}
            </ul>
          </div>

          {!readOnly && (
            <div>
              <p className="text-sm font-medium text-gray-800 mb-2">История подписания</p>
              <ActHistory items={history} loading={historyLoading} />
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">Файлы акта</p>
            <ActAttachments actId={act.id} readOnly={readOnly} />
          </div>
        </div>
      )}
    </div>
  );
};
