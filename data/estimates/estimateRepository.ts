import { dbClient } from '@/data/shared/dbClient';
import type {
  IEstimateRepository,
  IEstimateSection,
  IEstimateItem,
  IProjectEstimate,
  ICreateSectionInput,
  IUpdateSectionInput,
  ICreateItemInput,
  IUpdateItemInput,
} from '@/domain/estimates';

const calculateItemTotal = (quantity: string, unitPrice: string): number => {
  return parseFloat(quantity) * parseFloat(unitPrice);
};

export const estimateRepository: IEstimateRepository = {
  async getByProjectId(projectId: number): Promise<IProjectEstimate> {
    const sections = await dbClient.estimateSection.findMany({
      where: { projectId },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    let projectTotal = 0;

    const sectionsWithTotals = sections.map((section) => {
      let sectionTotal = 0;

      const items: IEstimateItem[] = section.items.map((item) => {
        const itemTotal = calculateItemTotal(item.quantity.toString(), item.unitPrice.toString());
        sectionTotal += itemTotal;
        projectTotal += itemTotal;

        return {
          id: item.id,
          sectionId: item.sectionId,
          sortOrder: item.sortOrder,
          name: item.name,
          unit: item.unit,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          comment: item.comment,
          status: item.status,
          isVisibleToClient: item.isVisibleToClient,
        };
      });

      return {
        id: section.id,
        projectId: section.projectId,
        name: section.name,
        sortOrder: section.sortOrder,
        items,
        total: sectionTotal,
      };
    });

    return {
      projectId,
      sections: sectionsWithTotals,
      total: projectTotal,
    };
  },

  async createSection(input: ICreateSectionInput): Promise<IEstimateSection> {
    const maxSortOrder = await dbClient.estimateSection.findFirst({
      where: { projectId: input.projectId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const sortOrder = maxSortOrder ? maxSortOrder.sortOrder + 1 : 0;

    const section = await dbClient.estimateSection.create({
      data: {
        projectId: input.projectId,
        name: input.name,
        sortOrder,
      },
    });

    return {
      id: section.id,
      projectId: section.projectId,
      name: section.name,
      sortOrder: section.sortOrder,
    };
  },

  async updateSection(id: number, input: IUpdateSectionInput): Promise<IEstimateSection> {
    const section = await dbClient.estimateSection.update({
      where: { id },
      data: { name: input.name },
    });

    return {
      id: section.id,
      projectId: section.projectId,
      name: section.name,
      sortOrder: section.sortOrder,
    };
  },

  async deleteSection(id: number): Promise<void> {
    await dbClient.estimateSection.delete({ where: { id } });
  },

  async createItem(input: ICreateItemInput): Promise<IEstimateItem> {
    const maxSortOrder = await dbClient.estimateItem.findFirst({
      where: { sectionId: input.sectionId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const sortOrder = maxSortOrder ? maxSortOrder.sortOrder + 1 : 0;

    const item = await dbClient.estimateItem.create({
      data: {
        sectionId: input.sectionId,
        sortOrder,
        name: input.name,
        unit: input.unit,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        comment: input.comment || null,
        status: input.status || 'DRAFT',
        isVisibleToClient: input.isVisibleToClient ?? true,
      },
    });

    return {
      id: item.id,
      sectionId: item.sectionId,
      sortOrder: item.sortOrder,
      name: item.name,
      unit: item.unit,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      comment: item.comment,
      status: item.status,
      isVisibleToClient: item.isVisibleToClient,
    };
  },

  async updateItem(id: number, input: IUpdateItemInput): Promise<IEstimateItem> {
    const data: Record<string, unknown> = {};
    
    if (input.name !== undefined) data.name = input.name;
    if (input.unit !== undefined) data.unit = input.unit;
    if (input.quantity !== undefined) data.quantity = input.quantity;
    if (input.unitPrice !== undefined) data.unitPrice = input.unitPrice;
    if (input.comment !== undefined) data.comment = input.comment;
    if (input.status !== undefined) data.status = input.status;
    if (input.isVisibleToClient !== undefined) data.isVisibleToClient = input.isVisibleToClient;

    const item = await dbClient.estimateItem.update({
      where: { id },
      data,
    });

    return {
      id: item.id,
      sectionId: item.sectionId,
      sortOrder: item.sortOrder,
      name: item.name,
      unit: item.unit,
      quantity: item.quantity.toString(),
      unitPrice: item.unitPrice.toString(),
      comment: item.comment,
      status: item.status,
      isVisibleToClient: item.isVisibleToClient,
    };
  },

  async deleteItem(id: number): Promise<void> {
    await dbClient.estimateItem.delete({ where: { id } });
  },
};
