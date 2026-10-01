'use client';

import { useMemo, useState } from 'react';
import type { IAct, IActPickerSection } from '@/domain/acts';
import { sumActItems } from '@/domain/acts';
import { toInputDate } from '../helpers/formatDate';
import { formatMoney } from '../helpers/formatMoney';
import { ActItemPicker } from './actItemPicker';

export interface IActFormValues {
  number: string;
  date: string;
  stage: string;
  comment: string;
  estimateItemIds: number[];
}

interface IActFormProps {
  suggestedNumber: string;
  pickerSections: IActPickerSection[];
  initial?: IAct;
  loading: boolean;
  onSubmit: (values: IActFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const ActForm = ({
  suggestedNumber,
  pickerSections,
  initial,
  loading,
  onSubmit,
  onCancel,
  submitLabel,
}: IActFormProps) => {
  const [values, setValues] = useState<IActFormValues>(() => {
    if (!initial) {
      return {
        number: suggestedNumber,
        date: toInputDate(new Date()),
        stage: '',
        comment: '',
        estimateItemIds: [],
      };
    }

    return {
      number: initial.number,
      date: toInputDate(initial.date),
      stage: initial.stage ?? '',
      comment: initial.comment ?? '',
      estimateItemIds: initial.items.map((item) => item.estimateItemId),
    };
  });

  const total = useMemo(() => {
    const amounts: number[] = [];

    for (const section of pickerSections) {
      for (const item of section.items) {
        if (values.estimateItemIds.includes(item.id)) amounts.push(item.amount);
      }
    }

    return sumActItems(amounts);
  }, [pickerSections, values.estimateItemIds]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="act-number" className="block text-sm font-medium text-gray-700 mb-1">
            Номер акта
          </label>
          <input
            id="act-number"
            type="text"
            value={values.number}
            onChange={(e) => setValues({ ...values, number: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="act-date" className="block text-sm font-medium text-gray-700 mb-1">
            Дата
          </label>
          <input
            id="act-date"
            type="date"
            value={values.date}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="act-stage" className="block text-sm font-medium text-gray-700 mb-1">
            Этап работ
          </label>
          <input
            id="act-stage"
            type="text"
            value={values.stage}
            onChange={(e) => setValues({ ...values, stage: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="act-comment" className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий
          </label>
          <textarea
            id="act-comment"
            value={values.comment}
            onChange={(e) => setValues({ ...values, comment: e.target.value })}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Позиции сметы</p>
        <ActItemPicker
          sections={pickerSections}
          selectedIds={values.estimateItemIds}
          editingActId={initial?.id}
          onChange={(estimateItemIds) => setValues({ ...values, estimateItemIds })}
        />
      </div>

      <p className="text-sm font-semibold text-gray-900 mb-4">Сумма по акту: {formatMoney(total)}</p>

      <p className="text-xs text-gray-500 mb-4">Вложения акта — скоро (загрузка файлов пока недоступна).</p>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};
