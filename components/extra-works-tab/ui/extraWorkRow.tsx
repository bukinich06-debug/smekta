'use client';

import type { IExtraWork } from '@/domain/extra-works';
import { getExtraWorkStatusLabel } from '@/domain/extra-works';
import { formatDate } from '../helpers/formatDate';
import { formatMoney } from '../helpers/formatMoney';

interface IExtraWorkRowProps {
  work: IExtraWork;
  loading: boolean;
  readOnly?: boolean;
  onEdit: (work: IExtraWork) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onMarkDone: (id: number) => void;
  onUnmarkDone: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onToggleBudget: (id: number) => void;
}

export const ExtraWorkRow = ({
  work,
  loading,
  readOnly,
  onEdit,
  onDelete,
  onToggleStatus,
  onMarkDone,
  onUnmarkDone,
  onToggleVisibility,
  onToggleBudget,
}: IExtraWorkRowProps) => {
  const rowClass = !work.isVisibleToClient && !readOnly
    ? 'border border-amber-200 bg-amber-50 rounded-lg p-4 mb-3'
    : 'border border-gray-200 rounded-lg p-4 mb-3';

  return (
    <div className={rowClass}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm text-gray-500">{formatDate(work.date)}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                work.status === 'DONE'
                  ? 'bg-indigo-100 text-indigo-800'
                  : work.status === 'AGREED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {getExtraWorkStatusLabel(work.status)}
            </span>
            {work.includedInBudget && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">В бюджете</span>
            )}
            {!readOnly && !work.isVisibleToClient && (
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">Скрыто от заказчика</span>
            )}
          </div>
          <p className="text-gray-900 font-medium whitespace-pre-wrap">{work.description}</p>
          <p className="text-sm text-gray-600 mt-1">
            {work.quantity} {work.unit} × {formatMoney(parseFloat(work.unitPrice))}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-gray-900">{formatMoney(work.amount)}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200/80">
        <button
          type="button"
          disabled
          className="text-sm text-gray-400 cursor-not-allowed"
          title="Загрузка файлов будет доступна позже"
        >
          Вложения (скоро)
        </button>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => onEdit(work)}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            Редактировать
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              if (window.confirm('Удалить допработу?')) onDelete(work.id);
            }}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Удалить
          </button>
          <button
            type="button"
            disabled={loading || work.status === 'DONE'}
            onClick={() => onToggleStatus(work.id)}
            className="text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            {work.status === 'AGREED' ? 'Снять согласование' : 'Отметить согласованной'}
          </button>
          {work.status === 'AGREED' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => onMarkDone(work.id)}
              className="text-sm text-indigo-700 hover:text-indigo-900 disabled:opacity-50"
            >
              Отметить выполненной
            </button>
          )}
          {work.status === 'DONE' && (
            <button
              type="button"
              disabled={loading}
              onClick={() => onUnmarkDone(work.id)}
              className="text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              Снять отметку выполнения
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={() => onToggleVisibility(work.id)}
            className="text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            {work.isVisibleToClient ? 'Скрыть от заказчика' : 'Показать заказчику'}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onToggleBudget(work.id)}
            className="text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            {work.includedInBudget ? 'Исключить из бюджета' : 'Включить в бюджет'}
          </button>
        </div>
      )}
    </div>
  );
};
