import type { ExtraWorkStatus } from '@prisma/client';

export const getExtraWorkStatusLabel = (status: ExtraWorkStatus): string => {
  if (status === 'DONE') return 'Выполнено';
  if (status === 'AGREED') return 'Согласовано';
  if (status === 'REJECTED') return 'Отклонено';
  return 'Не согласовано';
};
