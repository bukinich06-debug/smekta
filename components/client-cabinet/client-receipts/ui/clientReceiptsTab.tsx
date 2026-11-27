'use client';

import { useMemo, useState, useEffect } from 'react';
import type { IProjectReceipts, ReceiptStatusFilter } from '@/domain/receipts';
import type { IFile } from '@/domain/files';
import {
  ReceiptsTotals,
  ReceiptsFilters,
  ReceiptRow,
  filterReceiptsByStatus,
  sortReceiptsByDate,
} from '@/components/receipts-tab';
import { apiFetch } from '@/components/shared/api';

interface IClientReceiptsTabProps {
  data: IProjectReceipts;
}

export const ClientReceiptsTab = ({ data }: IClientReceiptsTabProps) => {
  const [statusFilter, setStatusFilter] = useState<ReceiptStatusFilter>('all');
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc');
  const [attachments, setAttachments] = useState<IFile[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);

  useEffect(() => {
    const loadAttachments = async () => {
      try {
        const files = await apiFetch<IFile[]>('/api/client/receipts/files');
        setAttachments(files);
      } catch (err) {
        console.error('Ошибка загрузки вложений:', err);
      } finally {
        setAttachmentsLoading(false);
      }
    };

    loadAttachments();
  }, []);

  const reloadAttachments = async () => {
    try {
      const files = await apiFetch<IFile[]>('/api/client/receipts/files');
      setAttachments(files);
    } catch (err) {
      console.error('Ошибка обновления вложений:', err);
    }
  };

  const displayedReceipts = useMemo(() => {
    const filtered = filterReceiptsByStatus(data.receipts, statusFilter);
    return sortReceiptsByDate(filtered, dateOrder);
  }, [data.receipts, statusFilter, dateOrder]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Чеки и оплаты</h2>

      <ReceiptsTotals
        totalDue={data.totalDue}
        totalPaid={data.totalPaid}
        totalRemainder={data.totalRemainder}
      />

      <ReceiptsFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateOrder={dateOrder}
        onDateOrderChange={setDateOrder}
      />

      {displayedReceipts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>Чеков пока нет</p>
        </div>
      )}

      {displayedReceipts.map((receipt) => (
        <ReceiptRow
          key={receipt.id}
          receipt={receipt}
          loading={false}
          readOnly
          onEdit={() => {}}
          onDelete={() => {}}
          onPayFull={() => {}}
          onPayPartial={() => {}}
          onDeletePayment={() => {}}
          allFiles={attachmentsLoading ? [] : attachments}
          onReloadFiles={reloadAttachments}
        />
      ))}
    </div>
  );
};
