'use client';

import { useState } from 'react';
import type { IReceipt } from '@/domain/receipts';
import { formatMoney } from '../helpers/formatMoney';
import { formatDate } from '../helpers/formatDate';
import { ReceiptStatusBadge } from './receiptStatusBadge';
import { ReceiptPayments } from './receiptPayments';

interface IReceiptRowProps {
  receipt: IReceipt;
  loading: boolean;
  onEdit: (receipt: IReceipt) => void;
  onDelete: (id: number) => void;
  onPayFull: (receiptId: number, date: Date) => void;
  onPayPartial: (receiptId: number, date: Date, amount: string) => void;
  onDeletePayment: (paymentId: number) => void;
  readOnly?: boolean;
}

export const ReceiptRow = ({
  receipt,
  loading,
  onEdit,
  onDelete,
  onPayFull,
  onPayPartial,
  onDeletePayment,
  readOnly,
}: IReceiptRowProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-left flex-1 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{receipt.title}</span>
            <ReceiptStatusBadge status={receipt.status} />
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(receipt.date)}
            {receipt.estimateSectionName && (
              <span className="ml-2">· {receipt.estimateSectionName}</span>
            )}
          </div>
        </button>
        <div className="text-right text-sm shrink-0">
          <div>
            К оплате: <span className="font-medium">{formatMoney(parseFloat(receipt.amountDue))}</span>
          </div>
          {receipt.paidFromDeposit > 0 && (
            <div className="text-emerald-800">Из депозита: {formatMoney(receipt.paidFromDeposit)}</div>
          )}
          {receipt.paidDirect > 0 && (
            <div className="text-green-700">Напрямую: {formatMoney(receipt.paidDirect)}</div>
          )}
          {receipt.paid <= 0 && <div className="text-gray-500">Оплачено: {formatMoney(0)}</div>}
          <div className="text-red-700">Остаток к оплате: {formatMoney(receipt.remainder)}</div>
        </div>
      </div>

      {receipt.comment && (
        <p className="text-sm text-gray-600 mt-2">{receipt.comment}</p>
      )}

      {!readOnly && (
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={() => onEdit(receipt)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Редактировать
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Удалить чек и все связанные оплаты?')) onDelete(receipt.id);
            }}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Удалить
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {expanded ? 'Скрыть оплаты' : 'Оплаты и история'}
          </button>
        </div>
      )}

      {readOnly && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 mt-2"
        >
          {expanded ? 'Скрыть историю оплат' : 'История оплат'}
        </button>
      )}

      {expanded && !readOnly && (
        <ReceiptPayments
          receipt={receipt}
          loading={loading}
          onPayFull={onPayFull}
          onPayPartial={onPayPartial}
          onDeletePayment={onDeletePayment}
        />
      )}

      {expanded && readOnly && receipt.payments.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          {receipt.payments.map((payment) => (
            <li key={payment.id} className="text-sm text-gray-700">
              {formatDate(payment.date)} — {formatMoney(parseFloat(payment.amount))}
              <span className="text-gray-500"> ({payment.source === 'DEPOSIT' ? 'из депозита' : 'напрямую'})</span>
            </li>
          ))}
        </ul>
      )}
      {expanded && readOnly && receipt.payments.length === 0 && (
        <p className="text-sm text-gray-500 mt-4 border-t border-gray-100 pt-4">Оплат пока нет</p>
      )}
    </div>
  );
};
