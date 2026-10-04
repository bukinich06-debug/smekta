'use client';

import type { IReceipt } from '@/domain/receipts';
import { getPaymentSourceLabel } from '@/domain/receipts';
import { formatMoney } from '../helpers/formatMoney';
import { formatDate, toInputDate, parseInputDate } from '../helpers/formatDate';
import { useState } from 'react';

interface IReceiptPaymentsProps {
  receipt: IReceipt;
  loading: boolean;
  onPayFull: (receiptId: number, date: Date) => void;
  onPayPartial: (receiptId: number, date: Date, amount: string) => void;
  onDeletePayment: (paymentId: number) => void;
}

export const ReceiptPayments = ({
  receipt,
  loading,
  onPayFull,
  onPayPartial,
  onDeletePayment,
}: IReceiptPaymentsProps) => {
  const [showPartial, setShowPartial] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(toInputDate(new Date()));

  const canPay = receipt.remainder > 0;

  const submitPartial = () => {
    const date = parseInputDate(paymentDate);
    if (!date) return;
    onPayPartial(receipt.id, date, partialAmount);
    setPartialAmount('');
    setShowPartial(false);
  };

  const payFull = () => {
    const date = parseInputDate(paymentDate);
    if (!date) return;
    onPayFull(receipt.id, date);
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">История оплат</h4>
      {receipt.payments.length === 0 && (
        <p className="text-sm text-gray-500 mb-3">Оплат пока нет</p>
      )}
      {receipt.payments.length > 0 && (
        <ul className="space-y-2 mb-4">
          {receipt.payments.map((payment) => (
            <li
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-2 text-sm bg-white border border-gray-100 rounded px-3 py-2"
            >
              <div>
                <span className="font-medium">{formatMoney(parseFloat(payment.amount))}</span>
                <span className="text-gray-500 ml-2">{formatDate(payment.date)}</span>
                <span className="text-gray-400 ml-2">— {payment.addedByName}</span>
                <span className="block text-xs text-gray-500 mt-0.5">{getPaymentSourceLabel(payment.source)}</span>
                {payment.comment && <p className="text-gray-500 text-xs mt-0.5">{payment.comment}</p>}
              </div>
              {payment.source === 'DIRECT' && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (window.confirm('Удалить эту оплату?')) onDeletePayment(payment.id);
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {canPay && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Дата оплаты</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={payFull}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Оплачено полностью ({formatMoney(receipt.remainder)})
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPartial(!showPartial)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Оплачено частично
            </button>
          </div>
          {showPartial && (
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Сумма</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={receipt.remainder}
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-32"
                />
              </div>
              <button
                type="button"
                disabled={loading || !partialAmount}
                onClick={submitPartial}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Добавить оплату
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
