'use client';

import type { ProjectInflowPurpose } from '@prisma/client';
import type { IProjectInflow } from '@/domain/finance';
import { useState } from 'react';

interface IInflowFormProps {
  loading: boolean;
  initial?: IProjectInflow;
  submitLabel: string;
  onSubmit: (data: {
    date: Date;
    amount: number;
    purpose: ProjectInflowPurpose;
    comment: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const toInputDate = (date: Date): string => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const InflowForm = ({ loading, initial, submitLabel, onSubmit, onCancel }: IInflowFormProps) => {
  const [date, setDate] = useState(toInputDate(initial?.date ?? new Date()));
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [purpose, setPurpose] = useState<ProjectInflowPurpose>(initial?.purpose ?? 'WORKS');
  const [comment, setComment] = useState(initial?.comment ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      date: new Date(date),
      amount: parseFloat(amount),
      purpose,
      comment,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Сумма</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Назначение</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as ProjectInflowPurpose)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="WORKS">Аванс на работы</option>
            <option value="MATERIALS">Депозит на материалы</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Комментарий</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitLabel}
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
