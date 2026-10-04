import type { ProjectStatus } from '@prisma/client';
import { getProjectStatusLabel } from '@/domain/clients';

interface IProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusClass: Record<ProjectStatus, string> = {
  PLANNING: 'bg-gray-100 text-gray-800 border-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-900 border-blue-200',
  PAUSED: 'bg-amber-100 text-amber-900 border-amber-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
};

export const ProjectStatusBadge = ({ status }: IProjectStatusBadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass[status]}`}
  >
    {getProjectStatusLabel(status)}
  </span>
);
