'use client';

import { useMemo, useState } from 'react';
import type { IProjectReceipts, ReceiptStatusFilter } from '@/domain/receipts';
import {
  ReceiptsTotals,
  ReceiptsFilters,
  ReceiptRow,
  filterReceiptsByStatus,
  sortReceiptsByDate,
} from '@/components/receipts-tab';

interface IClientReceiptsTabProps {
  data: IProjectReceipts;
}

export const ClientReceiptsTab = ({ data }: IClientReceiptsTabProps) => {
  const [statusFilter, setStatusFilter] = useState<ReceiptStatusFilter>('all');
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc');

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
        />
      ))}
    </div>
  );
};
