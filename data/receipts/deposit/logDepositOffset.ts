import { ActivityAction } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { RECEIPT_DEPOSIT_ENTITY_TYPE } from '@/domain/receipts';

interface ILogDepositOffsetParams {
  tx: Prisma.TransactionClient;
  userId: number;
  projectId: number;
  receiptId: number;
  action: ActivityAction;
  depositBefore: number;
  depositAfter: number;
  amountDelta: number;
  receiptTitle: string;
}

export const logDepositOffset = async ({
  tx,
  userId,
  projectId,
  receiptId,
  action,
  depositBefore,
  depositAfter,
  amountDelta,
  receiptTitle,
}: ILogDepositOffsetParams): Promise<void> => {
  await tx.activityLog.create({
    data: {
      userId,
      projectId,
      entityType: RECEIPT_DEPOSIT_ENTITY_TYPE,
      entityId: receiptId,
      action,
      changes: {
        receiptId,
        receiptTitle,
        depositOnReceiptBefore: depositBefore,
        depositOnReceiptAfter: depositAfter,
        amountDelta,
      },
    },
  });
};
