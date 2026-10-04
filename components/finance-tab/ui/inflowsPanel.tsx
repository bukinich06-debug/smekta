'use client';

import type { IProjectInflow, IWalletTransfer } from '@/domain/finance';
import { getInflowPurposeLabel, getWalletLabel } from '@/domain/finance';
import { formatDate } from '../helpers/formatDate';
import { formatMoney } from '../helpers/formatMoney';
import { InflowForm } from './inflowForm';
import { TransferForm } from './transferForm';

interface IInflowsPanelProps {
  readOnly: boolean;
  inflows: IProjectInflow[];
  transfers: IWalletTransfer[];
  actionLoading: boolean;
  showInflowForm: boolean;
  showTransferForm: boolean;
  editingInflow: IProjectInflow | null;
  editingTransfer: IWalletTransfer | null;
  onShowInflowForm: () => void;
  onShowTransferForm: () => void;
  onCancelForms: () => void;
  onCreateInflow: (data: {
    date: Date;
    amount: number;
    purpose: 'WORKS' | 'MATERIALS';
    comment: string;
  }) => Promise<void>;
  onUpdateInflow: (
    id: number,
    data: {
      date: Date;
      amount: number;
      purpose: 'WORKS' | 'MATERIALS';
      comment: string;
    }
  ) => Promise<void>;
  onDeleteInflow: (id: number) => Promise<void>;
  onCreateTransfer: (data: {
    date: Date;
    amount: number;
    fromWallet: 'WORKS' | 'MATERIALS';
    toWallet: 'WORKS' | 'MATERIALS';
    comment: string;
  }) => Promise<void>;
  onUpdateTransfer: (
    id: number,
    data: {
      date: Date;
      amount: number;
      fromWallet: 'WORKS' | 'MATERIALS';
      toWallet: 'WORKS' | 'MATERIALS';
      comment: string;
    }
  ) => Promise<void>;
  onDeleteTransfer: (id: number) => Promise<void>;
  onEditInflow: (row: IProjectInflow) => void;
  onEditTransfer: (row: IWalletTransfer) => void;
}

export const InflowsPanel = ({
  readOnly,
  inflows,
  transfers,
  actionLoading,
  showInflowForm,
  showTransferForm,
  editingInflow,
  editingTransfer,
  onShowInflowForm,
  onShowTransferForm,
  onCancelForms,
  onCreateInflow,
  onUpdateInflow,
  onDeleteInflow,
  onCreateTransfer,
  onUpdateTransfer,
  onDeleteTransfer,
  onEditInflow,
  onEditTransfer,
}: IInflowsPanelProps) => (
  <div>
    <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
      <h3 className="text-lg font-semibold text-gray-900">Поступления</h3>
      {!readOnly && !showInflowForm && !showTransferForm && !editingInflow && !editingTransfer && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onShowInflowForm}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Добавить поступление
          </button>
          <button
            type="button"
            onClick={onShowTransferForm}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Перевод между кошельками
          </button>
        </div>
      )}
    </div>

    {showInflowForm && (
      <InflowForm
        loading={actionLoading}
        submitLabel="Добавить"
        onSubmit={onCreateInflow}
        onCancel={onCancelForms}
      />
    )}

    {editingInflow && (
      <InflowForm
        loading={actionLoading}
        initial={editingInflow}
        submitLabel="Сохранить"
        onSubmit={(data) => onUpdateInflow(editingInflow.id, data)}
        onCancel={onCancelForms}
      />
    )}

    {showTransferForm && (
      <TransferForm
        loading={actionLoading}
        submitLabel="Добавить перевод"
        onSubmit={onCreateTransfer}
        onCancel={onCancelForms}
      />
    )}

    {editingTransfer && (
      <TransferForm
        loading={actionLoading}
        initial={editingTransfer}
        submitLabel="Сохранить"
        onSubmit={(data) => onUpdateTransfer(editingTransfer.id, data)}
        onCancel={onCancelForms}
      />
    )}

    <div className="space-y-4">
      {inflows.length === 0 && <p className="text-sm text-gray-500">Поступлений пока нет.</p>}
      {inflows.map((row) => (
        <div key={row.id} className="border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">{formatMoney(row.amount)}</p>
              <p className="text-sm text-gray-600">{getInflowPurposeLabel(row.purpose)}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>{formatDate(row.date)}</p>
              <p>{row.addedByName}</p>
            </div>
          </div>
          {row.comment && <p className="text-sm text-gray-600 mt-2">{row.comment}</p>}
          {!readOnly && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => onEditInflow(row)}
                className="text-sm text-blue-600 hover:underline"
              >
                Изменить
              </button>
              <button
                type="button"
                onClick={() => onDeleteInflow(row.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      ))}

      {transfers.length > 0 && (
        <div className="pt-2">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Переводы</h4>
          {transfers.map((row) => (
            <div key={row.id} className="border border-gray-200 rounded-lg p-3 mb-2">
              <div className="flex justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{formatMoney(row.amount)}</p>
                  <p className="text-sm text-gray-600">
                    {getWalletLabel(row.fromWallet)} → {getWalletLabel(row.toWallet)}
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{formatDate(row.date)}</p>
                  <p>{row.addedByName}</p>
                </div>
              </div>
              {row.comment && <p className="text-sm text-gray-600 mt-2">{row.comment}</p>}
              {!readOnly && (
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => onEditTransfer(row)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTransfer(row.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
