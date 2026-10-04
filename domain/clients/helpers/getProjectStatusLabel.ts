import type { ProjectStatus } from '@prisma/client';

export const getProjectStatusLabel = (status: ProjectStatus): string => {
  const labels: Record<ProjectStatus, string> = {
    PLANNING: 'Планирование',
    IN_PROGRESS: 'В работе',
    PAUSED: 'Приостановлен',
    COMPLETED: 'Завершён',
  };

  return labels[status];
};
