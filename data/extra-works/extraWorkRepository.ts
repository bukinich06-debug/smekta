import { dbClient } from '@/data/shared/dbClient';
import type { ExtraWork } from '@prisma/client';
import type {
  IExtraWorkRepository,
  IExtraWork,
  IProjectExtraWorks,
  IClientProjectExtraWorks,
  ICreateExtraWorkInput,
  IUpdateExtraWorkInput,
} from '@/domain/extra-works';
import {
  getExtraWorkAmount,
  sumExtraWorkListTotal,
  sumExtraWorksInBudget,
} from '@/domain/extra-works';

const mapRow = (row: ExtraWork): IExtraWork => {
  const quantity = row.quantity.toString();
  const unitPrice = row.unitPrice.toString();

  return {
    id: row.id,
    projectId: row.projectId,
    date: row.date,
    description: row.description,
    unit: row.unit,
    quantity,
    unitPrice,
    amount: getExtraWorkAmount(quantity, unitPrice),
    status: row.status,
    isVisibleToClient: row.isVisibleToClient,
    includedInBudget: row.includedInBudget,
  };
};

export const extraWorkRepository: IExtraWorkRepository = {
  async getByProjectId(projectId: number): Promise<IProjectExtraWorks> {
    const rows = await dbClient.extraWork.findMany({
      where: { projectId },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
    });

    const items = rows.map(mapRow);

    return {
      projectId,
      items,
      total: sumExtraWorkListTotal(items),
      budgetTotal: sumExtraWorksInBudget(items),
    };
  },

  async getClientVisibleByProjectId(projectId: number): Promise<IClientProjectExtraWorks> {
    const rows = await dbClient.extraWork.findMany({
      where: { projectId, isVisibleToClient: true },
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
    });

    const items = rows.map((row) => {
      const mapped = mapRow(row);
      return {
        id: mapped.id,
        date: mapped.date,
        description: mapped.description,
        unit: mapped.unit,
        quantity: mapped.quantity,
        unitPrice: mapped.unitPrice,
        amount: mapped.amount,
        status: mapped.status,
        includedInBudget: mapped.includedInBudget,
      };
    });

    return {
      projectId,
      items,
      total: sumExtraWorkListTotal(items),
      budgetTotal: sumExtraWorksInBudget(items),
    };
  },

  async create(input: ICreateExtraWorkInput): Promise<IExtraWork> {
    const row = await dbClient.extraWork.create({
      data: {
        projectId: input.projectId,
        date: input.date,
        description: input.description.trim(),
        unit: input.unit.trim(),
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        isVisibleToClient: input.isVisibleToClient ?? false,
        includedInBudget: input.includedInBudget ?? false,
      },
    });

    return mapRow(row);
  },

  async update(id: number, input: IUpdateExtraWorkInput): Promise<IExtraWork> {
    const row = await dbClient.extraWork.update({
      where: { id },
      data: {
        date: input.date,
        description: input.description?.trim(),
        unit: input.unit?.trim(),
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        isVisibleToClient: input.isVisibleToClient,
        includedInBudget: input.includedInBudget,
      },
    });

    return mapRow(row);
  },

  async delete(id: number): Promise<void> {
    await dbClient.extraWork.delete({ where: { id } });
  },

  async toggleStatus(id: number): Promise<IExtraWork> {
    const current = await dbClient.extraWork.findUnique({ where: { id } });
    if (!current) throw new Error('Допработа не найдена');

    const status = current.status === 'AGREED' ? 'PENDING' : 'AGREED';

    const row = await dbClient.extraWork.update({
      where: { id },
      data: { status },
    });

    return mapRow(row);
  },

  async toggleVisibility(id: number): Promise<IExtraWork> {
    const current = await dbClient.extraWork.findUnique({ where: { id } });
    if (!current) throw new Error('Допработа не найдена');

    const row = await dbClient.extraWork.update({
      where: { id },
      data: { isVisibleToClient: !current.isVisibleToClient },
    });

    return mapRow(row);
  },

  async toggleIncludedInBudget(id: number): Promise<IExtraWork> {
    const current = await dbClient.extraWork.findUnique({ where: { id } });
    if (!current) throw new Error('Допработа не найдена');

    const row = await dbClient.extraWork.update({
      where: { id },
      data: { includedInBudget: !current.includedInBudget },
    });

    return mapRow(row);
  },
};
