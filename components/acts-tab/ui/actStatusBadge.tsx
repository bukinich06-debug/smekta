import type { ActStatus } from '@prisma/client';
import { getActStatusLabel } from '@/domain/acts';

interface IActStatusBadgeProps {
  status: ActStatus;
}

const statusClass: Record<ActStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
  SENT: 'bg-blue-100 text-blue-900 border-blue-200',
  SIGNED: 'bg-green-100 text-green-800 border-green-200',
};

export const ActStatusBadge = ({ status }: IActStatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass[status]}`}
  >
    {getActStatusLabel(status)}
  </span>
);
