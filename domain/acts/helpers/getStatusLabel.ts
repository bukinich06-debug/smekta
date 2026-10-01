import type { ActStatus } from '@prisma/client';

export const getActStatusLabel = (status: ActStatus): string => {
  switch (status) {
    case 'DRAFT':
      return 'Черновик';
    case 'SENT':
      return 'Отправлен';
    case 'SIGNED':
      return 'Подписан';
  }
};
