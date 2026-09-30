import type { ReceiptStatus } from '@/domain/receipts';
import { getReceiptStatusLabel } from '@/domain/receipts';

interface IReceiptStatusBadgeProps {
  status: ReceiptStatus;
}

const statusClass: Record<ReceiptStatus, string> = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  underpaid: 'bg-amber-100 text-amber-900 border-amber-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
};

export const ReceiptStatusBadge = ({ status }: IReceiptStatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass[status]}`}
  >
    {getReceiptStatusLabel(status)}
  </span>
);
