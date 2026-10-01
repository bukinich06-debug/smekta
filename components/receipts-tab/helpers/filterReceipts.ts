import type { IReceipt, ReceiptStatusFilter } from '@/domain/receipts';

export const filterReceiptsByStatus = (
  receipts: IReceipt[],
  statusFilter: ReceiptStatusFilter,
): IReceipt[] => {
  if (statusFilter === 'all') return receipts;
  return receipts.filter((r) => r.status === statusFilter);
};

export const sortReceiptsByDate = (receipts: IReceipt[], order: 'asc' | 'desc'): IReceipt[] => {
  const sorted = [...receipts];
  sorted.sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === 'asc' ? diff : -diff;
  });
  return sorted;
};
