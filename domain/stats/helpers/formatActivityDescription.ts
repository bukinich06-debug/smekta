import type { ActivityAction } from '@prisma/client';
import { ACT_ENTITY_TYPE } from '@/domain/acts/constants';
import { PROJECT_INFLOW_ENTITY_TYPE, WALLET_TRANSFER_ENTITY_TYPE } from '@/domain/finance/constants';
import { PROJECT_TZ_ENTITY_TYPE } from '@/domain/project-tz/constants';
import { RECEIPT_DEPOSIT_ENTITY_TYPE } from '@/domain/receipts/constants';

const actionLabel: Record<ActivityAction, string> = {
  CREATE: 'Создание',
  UPDATE: 'Изменение',
  DELETE: 'Удаление',
  STATUS_CHANGE: 'Смена статуса',
};

const entityLabel: Record<string, string> = {
  [PROJECT_TZ_ENTITY_TYPE]: 'ТЗ проекта',
  [ACT_ENTITY_TYPE]: 'акт',
  [PROJECT_INFLOW_ENTITY_TYPE]: 'поступление',
  [WALLET_TRANSFER_ENTITY_TYPE]: 'перевод между кошельками',
  [RECEIPT_DEPOSIT_ENTITY_TYPE]: 'зачёт из депозита по чеку',
};

export const formatActivityDescription = (
  entityType: string,
  action: ActivityAction,
  entityId: number
): string => {
  const entity = entityLabel[entityType] ?? entityType;
  const verb = actionLabel[action] ?? action;

  return `${verb}: ${entity} №${entityId}`;
};
