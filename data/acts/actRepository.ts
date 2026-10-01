import { dbClient } from '@/data/shared/dbClient';
import type { ActStatus } from '@prisma/client';
import { ActivityAction } from '@prisma/client';
import type {
  IActRepository,
  IAct,
  IActLineItem,
  IProjectActs,
  IClientProjectActs,
  IClientAct,
  ICreateActInput,
  IUpdateActInput,
  IActPickerSection,
  IActStatusHistoryItem,
} from '@/domain/acts';
import {
  ACT_ENTITY_TYPE,
  getActItemAmount,
  sumActItems,
} from '@/domain/acts';

const actInclude = {
  items: {
    orderBy: { id: 'asc' as const },
    include: {
      estimateItem: {
        include: {
          section: { select: { name: true } },
        },
      },
    },
  },
};

const mapLineItem = (row: {
  id: number;
  estimateItemId: number;
  amount: { toString(): string };
  estimateItem: {
    name: string;
    unit: string;
    quantity: { toString(): string };
    unitPrice: { toString(): string };
    section: { name: string };
  };
}): IActLineItem => ({
  id: row.id,
  estimateItemId: row.estimateItemId,
  amount: parseFloat(row.amount.toString()),
  name: row.estimateItem.name,
  unit: row.estimateItem.unit,
  quantity: row.estimateItem.quantity.toString(),
  unitPrice: row.estimateItem.unitPrice.toString(),
  sectionName: row.estimateItem.section.name,
});

const mapAct = (row: {
  id: number;
  projectId: number;
  number: string;
  date: Date;
  stage: string | null;
  status: ActStatus;
  comment: string | null;
  items: {
    id: number;
    estimateItemId: number;
    amount: { toString(): string };
    estimateItem: {
      name: string;
      unit: string;
      quantity: { toString(): string };
      unitPrice: { toString(): string };
      section: { name: string };
    };
  }[];
}): IAct => {
  const items = row.items.map(mapLineItem);

  return {
    id: row.id,
    projectId: row.projectId,
    number: row.number,
    date: row.date,
    stage: row.stage,
    status: row.status,
    comment: row.comment,
    items,
    totalAmount: sumActItems(items.map((item) => item.amount)),
  };
};

const mapClientAct = (act: IAct): IClientAct => ({
  id: act.id,
  number: act.number,
  date: act.date,
  stage: act.stage,
  status: act.status,
  comment: act.comment,
  items: act.items,
  totalAmount: act.totalAmount,
});

const getSuggestedNumber = async (projectId: number): Promise<string> => {
  const acts = await dbClient.act.findMany({
    where: { projectId },
    select: { number: true },
  });

  let max = 0;
  for (const act of acts) {
    const parsed = parseInt(act.number, 10);
    if (!isNaN(parsed) && parsed > max) max = parsed;
  }

  return String(max + 1);
};

const buildPickerSections = async (
  projectId: number,
  excludeActId?: number,
): Promise<IActPickerSection[]> => {
  const [sections, assignments] = await Promise.all([
    dbClient.estimateSection.findMany({
      where: { projectId },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    dbClient.actItem.findMany({
      where: {
        act: { projectId },
        ...(excludeActId ? { actId: { not: excludeActId } } : {}),
      },
      select: {
        estimateItemId: true,
        actId: true,
        act: { select: { number: true } },
      },
    }),
  ]);

  const assignmentByItemId = new Map(
    assignments.map((row) => [
      row.estimateItemId,
      { actId: row.actId, number: row.act.number },
    ]),
  );

  return sections.map((section) => ({
    id: section.id,
    name: section.name,
    sortOrder: section.sortOrder,
    items: section.items.map((item) => {
      const quantity = item.quantity.toString();
      const unitPrice = item.unitPrice.toString();
      const assignment = assignmentByItemId.get(item.id);

      return {
        id: item.id,
        sectionId: section.id,
        sectionName: section.name,
        sortOrder: item.sortOrder,
        name: item.name,
        unit: item.unit,
        quantity,
        unitPrice,
        amount: getActItemAmount(quantity, unitPrice),
        assignedActId: assignment?.actId ?? null,
        assignedActNumber: assignment?.number ?? null,
      };
    }),
  }));
};

const loadEstimateItemsForAct = async (projectId: number, estimateItemIds: number[]) => {
  const items = await dbClient.estimateItem.findMany({
    where: {
      id: { in: estimateItemIds },
      section: { projectId },
    },
    include: { section: { select: { projectId: true } } },
  });

  if (items.length !== estimateItemIds.length) return null;

  return items;
};

const assertItemsAvailable = async (
  projectId: number,
  estimateItemIds: number[],
  excludeActId?: number,
): Promise<string | null> => {
  const taken = await dbClient.actItem.findFirst({
    where: {
      estimateItemId: { in: estimateItemIds },
      act: { projectId },
      ...(excludeActId ? { actId: { not: excludeActId } } : {}),
    },
    select: {
      estimateItem: { select: { name: true } },
      act: { select: { number: true } },
    },
  });

  if (!taken) return null;

  return `Позиция «${taken.estimateItem.name}» уже включена в акт №${taken.act.number}`;
};

export const actRepository: IActRepository = {
  async getByProjectId(projectId: number): Promise<IProjectActs> {
    const [acts, suggestedNumber, pickerSections] = await Promise.all([
      dbClient.act.findMany({
        where: { projectId },
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
        include: actInclude,
      }),
      getSuggestedNumber(projectId),
      buildPickerSections(projectId),
    ]);

    return {
      projectId,
      acts: acts.map(mapAct),
      suggestedNumber,
      pickerSections,
    };
  },

  async getClientVisibleByProjectId(projectId: number): Promise<IClientProjectActs> {
    const acts = await dbClient.act.findMany({
      where: {
        projectId,
        status: { in: ['SENT', 'SIGNED'] },
      },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      include: actInclude,
    });

    return {
      projectId,
      acts: acts.map(mapAct).map(mapClientAct),
    };
  },

  async getById(id: number): Promise<IAct | null> {
    const act = await dbClient.act.findUnique({
      where: { id },
      include: actInclude,
    });

    if (!act) return null;

    return mapAct(act);
  },

  async create(input: ICreateActInput): Promise<IAct> {
    const items = await loadEstimateItemsForAct(input.projectId, input.estimateItemIds);
    if (!items) throw new Error('ACT_ITEMS_INVALID');

    const conflict = await assertItemsAvailable(input.projectId, input.estimateItemIds);
    if (conflict) throw new Error(conflict);

    const act = await dbClient.act.create({
      data: {
        projectId: input.projectId,
        number: input.number.trim(),
        date: input.date,
        stage: input.stage?.trim() || null,
        comment: input.comment?.trim() || null,
        items: {
          create: items.map((item) => ({
            estimateItemId: item.id,
            amount: getActItemAmount(item.quantity.toString(), item.unitPrice.toString()),
          })),
        },
      },
      include: actInclude,
    });

    return mapAct(act);
  },

  async update(id: number, input: IUpdateActInput): Promise<IAct> {
    const existing = await dbClient.act.findUnique({
      where: { id },
      select: { projectId: true },
    });

    if (!existing) throw new Error('ACT_NOT_FOUND');

    if (input.estimateItemIds) {
      const items = await loadEstimateItemsForAct(existing.projectId, input.estimateItemIds);
      if (!items) throw new Error('ACT_ITEMS_INVALID');

      const conflict = await assertItemsAvailable(existing.projectId, input.estimateItemIds, id);
      if (conflict) throw new Error(conflict);
    }

    const act = await dbClient.$transaction(async (tx) => {
      if (input.estimateItemIds) {
        await tx.actItem.deleteMany({ where: { actId: id } });

        const items = await loadEstimateItemsForAct(existing.projectId, input.estimateItemIds);
        if (!items) throw new Error('ACT_ITEMS_INVALID');

        await tx.actItem.createMany({
          data: items.map((item) => ({
            actId: id,
            estimateItemId: item.id,
            amount: getActItemAmount(item.quantity.toString(), item.unitPrice.toString()),
          })),
        });
      }

      return await tx.act.update({
        where: { id },
        data: {
          number: input.number?.trim(),
          date: input.date,
          stage: input.stage === undefined ? undefined : input.stage?.trim() || null,
          comment: input.comment === undefined ? undefined : input.comment?.trim() || null,
        },
        include: actInclude,
      });
    });

    return mapAct(act);
  },

  async delete(id: number): Promise<void> {
    await dbClient.act.delete({ where: { id } });
  },

  async updateStatus(id: number, status: ActStatus, userId: number): Promise<IAct> {
    const act = await dbClient.$transaction(async (tx) => {
      const current = await tx.act.findUnique({
        where: { id },
        select: { id: true, projectId: true, status: true },
      });

      if (!current) throw new Error('ACT_NOT_FOUND');
      if (current.status === status) {
        return await tx.act.findUniqueOrThrow({
          where: { id },
          include: actInclude,
        });
      }

      const updated = await tx.act.update({
        where: { id },
        data: { status },
        include: actInclude,
      });

      await tx.activityLog.create({
        data: {
          userId,
          projectId: current.projectId,
          entityType: ACT_ENTITY_TYPE,
          entityId: id,
          action: ActivityAction.STATUS_CHANGE,
          changes: {
            status,
            previousStatus: current.status,
          },
        },
      });

      return updated;
    });

    return mapAct(act);
  },

  async listStatusHistory(actId: number): Promise<IActStatusHistoryItem[]> {
    const rows = await dbClient.activityLog.findMany({
      where: {
        entityType: ACT_ENTITY_TYPE,
        entityId: actId,
        action: ActivityAction.STATUS_CHANGE,
      },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });

    return rows.map((row) => {
      const changes = row.changes as { status?: ActStatus; previousStatus?: ActStatus | null } | null;

      return {
        id: row.id,
        createdAt: row.createdAt,
        authorName: row.user.name,
        status: changes?.status ?? 'DRAFT',
        previousStatus: changes?.previousStatus ?? null,
      };
    });
  },

  async getProjectIdByActId(actId: number): Promise<number | null> {
    const act = await dbClient.act.findUnique({
      where: { id: actId },
      select: { projectId: true },
    });

    return act?.projectId ?? null;
  },
};
