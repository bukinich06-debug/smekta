'use client';

import type { IReceipt, IReceiptSectionOption } from '@/domain/receipts';
import { toInputDate } from '../helpers/formatDate';

export interface IReceiptFormValues {
  date: string;
  title: string;
  amountDue: string;
  comment: string;
  estimateSectionId: string;
}

interface IReceiptFormProps {
  sections: IReceiptSectionOption[];
  initial?: IReceipt | null;
  loading: boolean;
  onSubmit: (values: IReceiptFormValues) => void;
  onCancel: () => void;
}

const emptyValues = (): IReceiptFormValues => ({
  date: toInputDate(new Date()),
  title: '',
  amountDue: '',
  comment: '',
  estimateSectionId: '',
});

export const ReceiptForm = ({ sections, initial, loading, onSubmit, onCancel }: IReceiptFormProps) => {
  const defaults = initial
    ? {
        date: toInputDate(initial.date),
        title: initial.title,
        amountDue: initial.amountDue,
        comment: initial.comment || '',
        estimateSectionId: initial.estimateSectionId ? String(initial.estimateSectionId) : '',
      }
    : emptyValues();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      date: String(form.get('date')),
      title: String(form.get('title')),
      amountDue: String(form.get('amountDue')),
      comment: String(form.get('comment')),
      estimateSectionId: String(form.get('estimateSectionId')),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {initial ? 'Редактирование чека' : 'Новый чек'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Дата</label>
          <input
            name="date"
            type="date"
            required
            defaultValue={defaults.date}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Сумма к оплате</label>
          <input
            name="amountDue"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={defaults.amountDue}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-500 mb-1">Наименование платежа</label>
          <input
            name="title"
            type="text"
            required
            maxLength={500}
            defaultValue={defaults.title}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-500 mb-1">Раздел сметы (необязательно)</label>
          <select
            name="estimateSectionId"
            defaultValue={defaults.estimateSectionId}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="">— Не привязан —</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-500 mb-1">Комментарий</label>
          <textarea
            name="comment"
            rows={2}
            maxLength={2000}
            defaultValue={defaults.comment}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-400 mb-2">Вложения (фото/PDF) — в следующей версии</p>
          <button type="button" disabled className="px-3 py-2 text-sm border border-gray-200 rounded-md text-gray-400 cursor-not-allowed">
            Прикрепить файл
          </button>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {initial ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};
