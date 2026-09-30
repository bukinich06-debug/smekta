import { dbClient } from '@/data/shared/dbClient';
import type {
  IClientRepository,
  IClientListItem,
  IClientWithProject,
  ICreateClientInput,
  IClientListFilters,
  IClientCardDetails,
  IUpdateClientCardInput,
  IClientInviteInfo,
} from '@/domain/clients';
import { Prisma } from '@prisma/client';

export const clientRepository: IClientRepository = {
  async list(filters: IClientListFilters): Promise<IClientListItem[]> {
    const where: Prisma.ClientWhereInput = {};

    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { projects: { some: { address: { contains: filters.search, mode: 'insensitive' } } } },
        { projects: { some: { number: { contains: filters.search, mode: 'insensitive' } } } },
        { projects: { some: { name: { contains: filters.search, mode: 'insensitive' } } } },
      ];
    }

    if (filters.status) {
      where.projects = { some: { status: filters.status } };
    }

    const clients = await dbClient.client.findMany({
      where,
      include: {
        projects: {
          take: 1,
          orderBy: { updatedAt: 'desc' },
          include: {
            estimateSections: {
              include: {
                items: true,
              },
            },
            receipts: {
              include: {
                payments: true,
              },
            },
          },
        },
      },
    });

    const items: IClientListItem[] = clients.map((client) => {
      const project = client.projects[0] || null;

      let estimateTotal = 0;
      let paid = 0;

      if (project) {
        for (const section of project.estimateSections) {
          for (const item of section.items) {
            const itemTotal = Number(item.quantity) * Number(item.unitPrice);
            estimateTotal += itemTotal;
          }
        }

        for (const receipt of project.receipts) {
          for (const payment of receipt.payments) {
            paid += Number(payment.amount);
          }
        }
      }

      const debt = estimateTotal - paid;

      return {
        id: client.id,
        fullName: client.fullName,
        address: project?.address || '',
        projectStatus: project?.status || null,
        estimateTotal,
        paid,
        debt,
        startDate: project?.startDate || null,
        updatedAt: project?.updatedAt || null,
      };
    });

    if (filters.sortBy) {
      const order = filters.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        const aVal = a[filters.sortBy!];
        const bVal = b[filters.sortBy!];

        if (aVal === null || aVal === undefined) return 1 * order;
        if (bVal === null || bVal === undefined) return -1 * order;

        if (aVal instanceof Date && bVal instanceof Date) {
          return (aVal.getTime() - bVal.getTime()) * order;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal, 'ru') * order;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * order;
        }

        return 0;
      });
    }

    return items;
  },

  async getCabinetByUserId(userId: number): Promise<IClientCardDetails | null> {
    const client = await dbClient.client.findFirst({
      where: { userId },
      include: {
        projects: {
          take: 1,
          orderBy: { updatedAt: 'desc' },
          include: {
            estimateSections: {
              include: {
                items: true,
              },
            },
            receipts: {
              include: {
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!client) return null;

    const project = client.projects[0] || null;

    let estimateTotal = 0;
    let paid = 0;

    if (project) {
      for (const section of project.estimateSections) {
        for (const item of section.items) {
          if (!item.isVisibleToClient) continue;

          const itemTotal = Number(item.quantity) * Number(item.unitPrice);
          estimateTotal += itemTotal;
        }
      }

      for (const receipt of project.receipts) {
        for (const payment of receipt.payments) {
          paid += Number(payment.amount);
        }
      }
    }

    const debt = estimateTotal - paid;

    return {
      id: client.id,
      fullName: client.fullName,
      phone: client.phone,
      email: client.email,
      userId: client.userId,
      inviteToken: client.inviteToken,
      userEmail: null,
      project: project
        ? {
            id: project.id,
            clientId: project.clientId,
            number: project.number,
            name: project.name,
            address: project.address,
            status: project.status,
            startDate: project.startDate,
            managerId: project.managerId,
            updatedAt: project.updatedAt,
          }
        : null,
      estimateTotal,
      paid,
      debt,
    };
  },

  async getById(id: number): Promise<IClientWithProject | null> {
    const client = await dbClient.client.findUnique({
      where: { id },
      include: {
        projects: {
          take: 1,
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!client) return null;

    return {
      id: client.id,
      fullName: client.fullName,
      phone: client.phone,
      email: client.email,
      userId: client.userId,
      inviteToken: client.inviteToken,
      project: client.projects[0]
        ? {
            id: client.projects[0].id,
            clientId: client.projects[0].clientId,
            number: client.projects[0].number,
            name: client.projects[0].name,
            address: client.projects[0].address,
            status: client.projects[0].status,
            startDate: client.projects[0].startDate,
            managerId: client.projects[0].managerId,
            updatedAt: client.projects[0].updatedAt,
          }
        : null,
    };
  },

  async create(input: ICreateClientInput, managerId: number): Promise<IClientWithProject> {
    const client = await dbClient.client.create({
      data: {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        projects: {
          create: {
            number: '',
            name: input.projectName,
            address: input.address,
            status: input.projectStatus,
            startDate: input.startDate,
            managerId,
          },
        },
      },
      include: {
        projects: true,
      },
    });

    const project = client.projects[0];

    await dbClient.project.update({
      where: { id: project.id },
      data: { number: project.id.toString() },
    });

    return {
      id: client.id,
      fullName: client.fullName,
      phone: client.phone,
      email: client.email,
      userId: client.userId,
      inviteToken: client.inviteToken,
      project: {
        id: project.id,
        clientId: project.clientId,
        number: project.id.toString(),
        name: project.name,
        address: project.address,
        status: project.status,
        startDate: project.startDate,
        managerId: project.managerId,
        updatedAt: project.updatedAt,
      },
    };
  },

  async getCardDetails(id: number): Promise<IClientCardDetails | null> {
    const client = await dbClient.client.findUnique({
      where: { id },
      include: {
        user: true,
        projects: {
          take: 1,
          orderBy: { updatedAt: 'desc' },
          include: {
            estimateSections: {
              include: {
                items: true,
              },
            },
            receipts: {
              include: {
                payments: true,
              },
            },
          },
        },
      },
    });

    if (!client) return null;

    const project = client.projects[0] || null;

    let estimateTotal = 0;
    let paid = 0;

    if (project) {
      for (const section of project.estimateSections) {
        for (const item of section.items) {
          const itemTotal = Number(item.quantity) * Number(item.unitPrice);
          estimateTotal += itemTotal;
        }
      }

      for (const receipt of project.receipts) {
        for (const payment of receipt.payments) {
          paid += Number(payment.amount);
        }
      }
    }

    const debt = estimateTotal - paid;

    return {
      id: client.id,
      fullName: client.fullName,
      phone: client.phone,
      email: client.email,
      userId: client.userId,
      inviteToken: client.inviteToken,
      userEmail: client.user?.email || null,
      project: project
        ? {
            id: project.id,
            clientId: project.clientId,
            number: project.number,
            name: project.name,
            address: project.address,
            status: project.status,
            startDate: project.startDate,
            managerId: project.managerId,
            updatedAt: project.updatedAt,
          }
        : null,
      estimateTotal,
      paid,
      debt,
    };
  },

  async updateCard(
    clientId: number,
    projectId: number,
    input: IUpdateClientCardInput
  ): Promise<void> {
    await dbClient.$transaction([
      dbClient.client.update({
        where: { id: clientId },
        data: {
          fullName: input.fullName,
          phone: input.phone,
          email: input.email,
        },
      }),
      dbClient.project.update({
        where: { id: projectId },
        data: {
          name: input.projectName,
          address: input.address,
          status: input.projectStatus,
          startDate: input.startDate,
          managerId: input.managerId,
        },
      }),
    ]);
  },

  async generateInviteToken(clientId: number, token: string): Promise<void> {
    await dbClient.client.update({
      where: { id: clientId },
      data: { inviteToken: token },
    });
  },

  async getByInviteToken(token: string): Promise<IClientInviteInfo | null> {
    const client = await dbClient.client.findUnique({
      where: { inviteToken: token },
      include: {
        projects: {
          take: 1,
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!client) return null;

    const project = client.projects[0] || null;

    return {
      id: client.id,
      fullName: client.fullName,
      projectNumber: project?.number || null,
      projectName: project?.name || null,
      projectAddress: project?.address || null,
    };
  },

  async acceptInvite(token: string, userId: number): Promise<boolean> {
    const result = await dbClient.client.updateMany({
      where: {
        inviteToken: token,
        userId: null,
      },
      data: {
        userId,
        inviteToken: null,
      },
    });

    return result.count > 0;
  },
};
