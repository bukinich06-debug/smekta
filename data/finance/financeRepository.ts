import { dbClient } from '@/data/shared/dbClient';
import { lockProjectFinance } from '@/data/shared/projectFinanceLock';
import { finishMaterialsWalletMutation } from '@/data/receipts/deposit/applyMaterialsWalletSideEffects';
import { getMaterialsWalletBalance } from '@/data/receipts/helpers/materialsWalletBalance';
import { ActivityAction } from '@prisma/client';
import type {
  IFinanceRepository,
  IProjectFinance,
  IClientProjectFinance,
  ICreateInflowInput,
  IUpdateInflowInput,
  ICreateTransferInput,
  IUpdateTransferInput,
  IProjectInflow,
  IWalletTransfer,
  IFinanceHistoryItem,
} from '@/domain/finance';
import {
  PROJECT_INFLOW_ENTITY_TYPE,
  WALLET_TRANSFER_ENTITY_TYPE,
  getInflowPurposeLabel,
  getWalletLabel,
} from '@/domain/finance';
import {
  buildFinanceViewFromProject,
  projectFinanceQueryInclude,
} from './projectFinanceLoader';

const mapInflow = (row: {
  id: number;
  projectId: number;
  date: Date;
  amount: { toString(): string };
  purpose: 'WORKS' | 'MATERIALS';
  comment: string | null;
  addedById: number;
  addedBy: { name: string };
}): IProjectInflow => ({
  id: row.id,
  projectId: row.projectId,
  date: row.date,
  amount: parseFloat(row.amount.toString()),
  purpose: row.purpose,
  comment: row.comment,
  addedById: row.addedById,
  addedByName: row.addedBy.name,
});

const mapTransfer = (row: {
  id: number;
  projectId: number;
  date: Date;
  amount: { toString(): string };
  fromWallet: 'WORKS' | 'MATERIALS';
  toWallet: 'WORKS' | 'MATERIALS';
  comment: string | null;
  addedById: number;
  addedBy: { name: string };
}): IWalletTransfer => ({
  id: row.id,
  projectId: row.projectId,
  date: row.date,
  amount: parseFloat(row.amount.toString()),
  fromWallet: row.fromWallet,
  toWallet: row.toWallet,
  comment: row.comment,
  addedById: row.addedById,
  addedByName: row.addedBy.name,
});

const loadProject = async (projectId: number) => {
  const project = await dbClient.project.findUnique({
    where: { id: projectId },
    include: projectFinanceQueryInclude,
  });

  if (!project) throw new Error('PROJECT_NOT_FOUND');

  return project;
};

const buildProjectFinance = async (
  projectId: number,
  clientLedgerView: boolean
): Promise<IProjectFinance> => {
  const project = await loadProject(projectId);
  const view = buildFinanceViewFromProject(project, { clientLedgerView });

  const inflows = project.inflows.map((row) => mapInflow({ ...row, projectId }));

  const transfers = project.walletTransfers.map((row) => mapTransfer({ ...row, projectId }));

  return {
    projectId,
    summary: view.summary,
    inflows,
    transfers,
    ledger: view.ledger,
    dueExtraWorks: view.dueExtraWorks,
    pendingExtraWorks: view.pendingExtraWorks,
  };
};

const snapshotInflow = (row: {
  date: Date;
  amount: { toString(): string };
  purpose: 'WORKS' | 'MATERIALS';
  comment: string | null;
}) => ({
  date: row.date.toISOString(),
  amount: parseFloat(row.amount.toString()),
  purpose: row.purpose,
  comment: row.comment,
});

const snapshotTransfer = (row: {
  date: Date;
  amount: { toString(): string };
  fromWallet: 'WORKS' | 'MATERIALS';
  toWallet: 'WORKS' | 'MATERIALS';
  comment: string | null;
}) => ({
  date: row.date.toISOString(),
  amount: parseFloat(row.amount.toString()),
  fromWallet: row.fromWallet,
  toWallet: row.toWallet,
  comment: row.comment,
});

const formatHistoryDetail = (
  entityType: string,
  action: ActivityAction,
  changes: Record<string, unknown> | null
): { label: string; detail: string } => {
  if (entityType === PROJECT_INFLOW_ENTITY_TYPE) {
    const before = changes?.before as { amount?: number; purpose?: string } | undefined;
    const after = changes?.after as { amount?: number; purpose?: string } | undefined;
    const amount = after?.amount ?? before?.amount;

    if (action === ActivityAction.DELETE) {
      return {
        label: 'Поступление удалено',
        detail: `${amount ?? '—'} ₽`,
      };
    }

    if (action === ActivityAction.CREATE) {
      return {
        label: 'Поступление добавлено',
        detail: `${amount ?? '—'} ₽`,
      };
    }

    const prev = before?.amount;
    const next = after?.amount;
    return {
      label: 'Поступление изменено',
      detail: prev !== undefined && next !== undefined ? `${prev} ₽ → ${next} ₽` : `${next ?? prev} ₽`,
    };
  }

  const before = changes?.before as { amount?: number } | undefined;
  const after = changes?.after as { amount?: number } | undefined;
  const amount = after?.amount ?? before?.amount;

  if (action === ActivityAction.DELETE) {
    return {
      label: 'Перевод удалён',
      detail: `${amount ?? '—'} ₽`,
    };
  }

  if (action === ActivityAction.CREATE) {
    return {
      label: 'Перевод добавлен',
      detail: `${amount ?? '—'} ₽`,
    };
  }

  const prev = before?.amount;
  const next = after?.amount;
  return {
    label: 'Перевод изменён',
    detail: prev !== undefined && next !== undefined ? `${prev} ₽ → ${next} ₽` : `${next ?? prev} ₽`,
  };
};

export const financeRepository: IFinanceRepository = {
  async getByProjectId(projectId: number): Promise<IProjectFinance> {
    return await buildProjectFinance(projectId, false);
  },

  async getClientByProjectId(projectId: number): Promise<IClientProjectFinance> {
    const data = await buildProjectFinance(projectId, true);
    return data;
  },

  async createInflow(input: ICreateInflowInput, userId: number): Promise<IProjectInflow> {
    const row = await dbClient.$transaction(async (tx) => {
      await lockProjectFinance(tx, input.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, input.projectId);

      const created = await tx.projectInflow.create({
        data: {
          projectId: input.projectId,
          date: input.date,
          amount: input.amount,
          purpose: input.purpose,
          comment: input.comment?.trim() || null,
          addedById: userId,
        },
        include: { addedBy: { select: { name: true } } },
      });

      await tx.activityLog.create({
        data: {
          userId,
          projectId: input.projectId,
          entityType: PROJECT_INFLOW_ENTITY_TYPE,
          entityId: created.id,
          action: ActivityAction.CREATE,
          changes: {
            after: snapshotInflow(created),
          },
        },
      });

      await finishMaterialsWalletMutation(tx, input.projectId, userId, balanceBefore);

      return created;
    });

    return mapInflow(row);
  },

  async updateInflow(id: number, input: IUpdateInflowInput, userId: number): Promise<IProjectInflow> {
    const row = await dbClient.$transaction(async (tx) => {
      const current = await tx.projectInflow.findUnique({
        where: { id },
        include: { addedBy: { select: { name: true } } },
      });

      if (!current) throw new Error('INFLOW_NOT_FOUND');

      await lockProjectFinance(tx, current.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, current.projectId);

      const updated = await tx.projectInflow.update({
        where: { id },
        data: {
          date: input.date,
          amount: input.amount,
          purpose: input.purpose,
          comment: input.comment === undefined ? undefined : input.comment?.trim() || null,
        },
        include: { addedBy: { select: { name: true } } },
      });

      await tx.activityLog.create({
        data: {
          userId,
          projectId: current.projectId,
          entityType: PROJECT_INFLOW_ENTITY_TYPE,
          entityId: id,
          action: ActivityAction.UPDATE,
          changes: {
            before: snapshotInflow(current),
            after: snapshotInflow(updated),
          },
        },
      });

      await finishMaterialsWalletMutation(tx, current.projectId, userId, balanceBefore);

      return updated;
    });

    return mapInflow(row);
  },

  async deleteInflow(id: number, userId: number): Promise<void> {
    await dbClient.$transaction(async (tx) => {
      const current = await tx.projectInflow.findUnique({ where: { id } });
      if (!current) throw new Error('INFLOW_NOT_FOUND');

      await lockProjectFinance(tx, current.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, current.projectId);

      await tx.activityLog.create({
        data: {
          userId,
          projectId: current.projectId,
          entityType: PROJECT_INFLOW_ENTITY_TYPE,
          entityId: id,
          action: ActivityAction.DELETE,
          changes: {
            before: snapshotInflow(current),
          },
        },
      });

      await tx.projectInflow.delete({ where: { id } });

      await finishMaterialsWalletMutation(tx, current.projectId, userId, balanceBefore);
    });
  },

  async createTransfer(input: ICreateTransferInput, userId: number): Promise<IWalletTransfer> {
    const row = await dbClient.$transaction(async (tx) => {
      await lockProjectFinance(tx, input.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, input.projectId);

      const created = await tx.walletTransfer.create({
        data: {
          projectId: input.projectId,
          date: input.date,
          amount: input.amount,
          fromWallet: input.fromWallet,
          toWallet: input.toWallet,
          comment: input.comment?.trim() || null,
          addedById: userId,
        },
        include: { addedBy: { select: { name: true } } },
      });

      await tx.activityLog.create({
        data: {
          userId,
          projectId: input.projectId,
          entityType: WALLET_TRANSFER_ENTITY_TYPE,
          entityId: created.id,
          action: ActivityAction.CREATE,
          changes: {
            after: snapshotTransfer(created),
          },
        },
      });

      await finishMaterialsWalletMutation(tx, input.projectId, userId, balanceBefore);

      return created;
    });

    return mapTransfer(row);
  },

  async updateTransfer(id: number, input: IUpdateTransferInput, userId: number): Promise<IWalletTransfer> {
    const row = await dbClient.$transaction(async (tx) => {
      const current = await tx.walletTransfer.findUnique({
        where: { id },
        include: { addedBy: { select: { name: true } } },
      });

      if (!current) throw new Error('TRANSFER_NOT_FOUND');

      await lockProjectFinance(tx, current.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, current.projectId);

      const updated = await tx.walletTransfer.update({
        where: { id },
        data: {
          date: input.date,
          amount: input.amount,
          fromWallet: input.fromWallet,
          toWallet: input.toWallet,
          comment: input.comment === undefined ? undefined : input.comment?.trim() || null,
        },
        include: { addedBy: { select: { name: true } } },
      });

      await tx.activityLog.create({
        data: {
          userId,
          projectId: current.projectId,
          entityType: WALLET_TRANSFER_ENTITY_TYPE,
          entityId: id,
          action: ActivityAction.UPDATE,
          changes: {
            before: snapshotTransfer(current),
            after: snapshotTransfer(updated),
          },
        },
      });

      await finishMaterialsWalletMutation(tx, current.projectId, userId, balanceBefore);

      return updated;
    });

    return mapTransfer(row);
  },

  async deleteTransfer(id: number, userId: number): Promise<void> {
    await dbClient.$transaction(async (tx) => {
      const current = await tx.walletTransfer.findUnique({ where: { id } });
      if (!current) throw new Error('TRANSFER_NOT_FOUND');

      await lockProjectFinance(tx, current.projectId);
      const balanceBefore = await getMaterialsWalletBalance(tx, current.projectId);

      await tx.activityLog.create({
        data: {
          userId,
          projectId: current.projectId,
          entityType: WALLET_TRANSFER_ENTITY_TYPE,
          entityId: id,
          action: ActivityAction.DELETE,
          changes: {
            before: snapshotTransfer(current),
          },
        },
      });

      await tx.walletTransfer.delete({ where: { id } });

      await finishMaterialsWalletMutation(tx, current.projectId, userId, balanceBefore);
    });
  },

  async listMoneyHistory(projectId: number): Promise<IFinanceHistoryItem[]> {
    const rows = await dbClient.activityLog.findMany({
      where: {
        projectId,
        entityType: { in: [PROJECT_INFLOW_ENTITY_TYPE, WALLET_TRANSFER_ENTITY_TYPE] },
      },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });

    return rows.map((row) => {
      const changes = row.changes as Record<string, unknown> | null;
      const { label, detail } = formatHistoryDetail(row.entityType, row.action, changes);

      const after = changes?.after as { purpose?: string; fromWallet?: string; toWallet?: string } | undefined;
      const before = changes?.before as { purpose?: string } | undefined;
      const purpose = after?.purpose ?? before?.purpose;
      let extra = '';

      if (row.entityType === PROJECT_INFLOW_ENTITY_TYPE && purpose)
        extra = ` (${getInflowPurposeLabel(purpose as 'WORKS' | 'MATERIALS')})`;

      if (row.entityType === WALLET_TRANSFER_ENTITY_TYPE && after?.fromWallet && after?.toWallet)
        extra = ` (${getWalletLabel(after.fromWallet as 'WORKS' | 'MATERIALS')} → ${getWalletLabel(after.toWallet as 'WORKS' | 'MATERIALS')})`;

      return {
        id: row.id,
        createdAt: row.createdAt,
        authorName: row.user.name,
        entityType: row.entityType,
        entityId: row.entityId,
        action: row.action,
        label,
        detail: `${detail}${extra}`,
      };
    });
  },

  async getProjectIdByInflowId(inflowId: number): Promise<number | null> {
    const row = await dbClient.projectInflow.findUnique({
      where: { id: inflowId },
      select: { projectId: true },
    });

    return row?.projectId ?? null;
  },

  async getProjectIdByTransferId(transferId: number): Promise<number | null> {
    const row = await dbClient.walletTransfer.findUnique({
      where: { id: transferId },
      select: { projectId: true },
    });

    return row?.projectId ?? null;
  },

  async getTransferById(id: number): Promise<IWalletTransfer | null> {
    const row = await dbClient.walletTransfer.findUnique({
      where: { id },
      include: { addedBy: { select: { name: true } } },
    });

    if (!row) return null;

    return mapTransfer(row);
  },
};
