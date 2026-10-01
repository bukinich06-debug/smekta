'use client';

import type { WalletType } from '@prisma/client';
import type { IWalletTransfer } from '@/domain/finance';
import { useState } from 'react';

interface ITransferFormProps {
  loading: boolean;
  initial?: IWalletTransfer;
  submitLabel: string;
  onSubmit: (data: {
    date: Date;
    amount: number;
    fromWallet: WalletType;
    toWallet: WalletType;
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

export const TransferForm = ({ loading, initial, submitLabel, onSubmit, onCancel }: ITransferFormProps) => {
  const [date, setDate] = useState(toInputDate(initial?.date ?? new Date()));
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [fromWallet, setFromWallet] = useState<WalletType>(initial?.fromWallet ?? 'WORKS');
  const [toWallet, setToWallet] = useState<WalletType>(initial?.toWallet ?? 'MATERIALS');
  const [comment, setComment] = useState(initial?.comment ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      date: new Date(date),
      amount: parseFloat(amount),
      fromWallet,
      toWallet,
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
        <div>
          <label className="block text-sm text-gray-600 mb-1">Из кошелька</label>
          <select
            value={fromWallet}
            onChange={(e) => setFromWallet(e.target.value as WalletType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="WORKS">Работы</option>
            <option value="MATERIALS">Материалы</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">В кошелёк</label>
          <select
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value as WalletType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="WORKS">Работы</option>
            <option value="MATERIALS">Материалы</option>
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
