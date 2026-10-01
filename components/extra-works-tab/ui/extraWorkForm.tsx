'use client';

import { useMemo, useState } from 'react';
import type { IExtraWork } from '@/domain/extra-works';
import { toInputDate } from '../helpers/formatDate';
import { formatMoney } from '../helpers/formatMoney';

const calcLineAmount = (quantity: string, unitPrice: string) => Number(quantity) * Number(unitPrice);

export interface IExtraWorkFormValues {
  date: string;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  isVisibleToClient: boolean;
  includedInBudget: boolean;
}

interface IExtraWorkFormProps {
  initial?: IExtraWork;
  loading: boolean;
  onSubmit: (values: IExtraWorkFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}

const emptyValues: IExtraWorkFormValues = {
  date: toInputDate(new Date()),
  description: '',
  unit: 'шт',
  quantity: '1',
  unitPrice: '0',
  isVisibleToClient: false,
  includedInBudget: false,
};

export const ExtraWorkForm = ({ initial, loading, onSubmit, onCancel, submitLabel }: IExtraWorkFormProps) => {
  const [values, setValues] = useState<IExtraWorkFormValues>(() => {
    if (!initial) return emptyValues;

    return {
      date: toInputDate(initial.date),
      description: initial.description,
      unit: initial.unit,
      quantity: initial.quantity,
      unitPrice: initial.unitPrice,
      isVisibleToClient: initial.isVisibleToClient,
      includedInBudget: initial.includedInBudget,
    };
  });

  const liveAmount = useMemo(
    () => calcLineAmount(values.quantity, values.unitPrice),
    [values.quantity, values.unitPrice]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
          <input
            type="date"
            value={values.date}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ед. изм.</label>
          <input
            type="text"
            value={values.unit}
            onChange={(e) => setValues({ ...values, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Количество</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={values.quantity}
            onChange={(e) => setValues({ ...values, quantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена за ед.</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.unitPrice}
            onChange={(e) => setValues({ ...values, unitPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
            required
          />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600">
            Сумма: <span className="font-semibold text-gray-900">{formatMoney(liveAmount)}</span>
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.isVisibleToClient}
            onChange={(e) => setValues({ ...values, isVisibleToClient: e.target.checked })}
          />
          Показывать заказчику
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.includedInBudget}
            onChange={(e) => setValues({ ...values, includedInBudget: e.target.checked })}
          />
          Включить в общий бюджет
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};
