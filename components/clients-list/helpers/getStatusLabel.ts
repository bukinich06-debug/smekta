import type { ProjectStatus } from '@prisma/client';

export const getStatusLabel = (status: ProjectStatus | null): string => {
  if (!status) return '—';

  const labels: Record<ProjectStatus, string> = {
    PLANNING: 'Планирование',
    IN_PROGRESS: 'В работе',
    PAUSED: 'Приостановлен',
    COMPLETED: 'Завершён',
  };

  return labels[status];
};
