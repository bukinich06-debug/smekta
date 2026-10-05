import {
  ActivityAction,
  ActStatus,
  EstimateItemStatus,
  ExtraWorkStatus,
  PaymentSource,
  ProjectInflowPurpose,
  ProjectStatus,
  WalletType,
} from '@prisma/client';
import { dbClient } from '@/data/shared/dbClient';
import { ACT_ENTITY_TYPE } from '@/domain/acts/constants';
import { PROJECT_INFLOW_ENTITY_TYPE, WALLET_TRANSFER_ENTITY_TYPE } from '@/domain/finance/constants';
import { PROJECT_TZ_ENTITY_TYPE } from '@/domain/project-tz/constants';
import { RECEIPT_DEPOSIT_ENTITY_TYPE } from '@/domain/receipts/constants';
import {
  SEED_PROJECT_KOVALEVA,
  SEED_PROJECT_NOVIKOVA,
  SEED_PROJECT_PETROV,
  SEED_PROJECT_SIDORENKO,
} from './constants';
import { daysAgo, monthsAgo } from './dates';
import { ensureSeedClients } from './ensureClients';
import type { ISeedReport } from './report';
import { markCreated, markSkipped } from './report';

interface ISeedUsers {
  adminId: number;
  clientUserIds: number[];
}

const findDemoProject = async (name: string) =>
  dbClient.project.findFirst({ where: { name } });

export const seedContent = async (
  { adminId, clientUserIds }: ISeedUsers,
  report: ISeedReport
): Promise<void> => {
  const { kovaleva: clientKovaleva, petrov: clientPetrov, sidorenko: clientSidorenko, novikova: clientNovikova } =
    await ensureSeedClients(clientUserIds, report);

  const seededProjects: { projectId: number; clientId: number }[] = [];

  if (await findDemoProject(SEED_PROJECT_KOVALEVA)) {
    markSkipped(report, `проект «${SEED_PROJECT_KOVALEVA}»`);
  } else {
  const project1 = await createProject({
    clientId: clientKovaleva.id,
    managerId: adminId,
    name: SEED_PROJECT_KOVALEVA,
    address: 'г. Москва, ул. Арбат, д. 12, кв. 45',
    status: ProjectStatus.IN_PROGRESS,
    startDate: monthsAgo(3, 5),
    tzText: `Техническое задание на капитальный ремонт квартиры 52 м².

1. Демонтаж старых покрытий, выравнивание стен и полов.
2. Полная замена электропроводки с установкой УЗО.
3. Разводка сантехники: ванная, кухня, стиральная машина.
4. Чистовая отделка: ламинат, обои, натяжные потолки.
5. Установка межкомнатных дверей и плинтусов.

Срок выполнения: 3–4 месяца. Работы ведутся поэтапно с промежуточными актами.`,
    tzUpdatedAt: monthsAgo(3, 4),
    tzUpdatedById: adminId,
  });

    await seedProject1Finance(project1.id, adminId);
    await seedProject1Estimate(project1.id);
    await seedProject1ActsAndExtra(project1.id, adminId);
    await seedProject1Receipts(project1.id, adminId);
    markCreated(report, `проект «${SEED_PROJECT_KOVALEVA}»`);
    seededProjects.push({ projectId: project1.id, clientId: clientKovaleva.id });
  }

  if (await findDemoProject(SEED_PROJECT_PETROV)) {
    markSkipped(report, `проект «${SEED_PROJECT_PETROV}»`);
  } else {
    const project2 = await createProject({
      clientId: clientPetrov.id,
      managerId: adminId,
      name: SEED_PROJECT_PETROV,
      address: 'г. Москва, Ленинский пр-т, д. 88, кв. 102',
      status: ProjectStatus.COMPLETED,
      startDate: monthsAgo(5, 10),
      tzText:
        'Косметический ремонт студии 28 м²: покраска стен, замена напольного покрытия, обновление санузла.',
      tzUpdatedAt: monthsAgo(5, 9),
      tzUpdatedById: adminId,
    });
    await seedProject2Full(project2.id, adminId);
    markCreated(report, `проект «${SEED_PROJECT_PETROV}»`);
    seededProjects.push({ projectId: project2.id, clientId: clientPetrov.id });
  }

  if (await findDemoProject(SEED_PROJECT_SIDORENKO)) {
    markSkipped(report, `проект «${SEED_PROJECT_SIDORENKO}»`);
  } else {
    const project3 = await createProject({
      clientId: clientSidorenko.id,
      managerId: adminId,
      name: SEED_PROJECT_SIDORENKO,
      address: 'г. Москва, ул. Профсоюзная, д. 50, кв. 7',
      status: ProjectStatus.PLANNING,
      startDate: null,
      tzText:
        'Планируется ремонт кухни 14 м²: демонтаж, новая электрика под встраиваемую технику, плитка, натяжной потолок.',
      tzUpdatedAt: daysAgo(12),
      tzUpdatedById: adminId,
    });
    await seedProject3Planning(project3.id, adminId);
    markCreated(report, `проект «${SEED_PROJECT_SIDORENKO}»`);
    seededProjects.push({ projectId: project3.id, clientId: clientSidorenko.id });
  }

  if (await findDemoProject(SEED_PROJECT_NOVIKOVA)) {
    markSkipped(report, `проект «${SEED_PROJECT_NOVIKOVA}»`);
  } else {
    const project4 = await createProject({
      clientId: clientNovikova.id,
      managerId: adminId,
      name: SEED_PROJECT_NOVIKOVA,
      address: 'г. Москва, ул. Барклая, д. 156, кв. 12',
      status: ProjectStatus.PAUSED,
      startDate: monthsAgo(2, 20),
      tzText:
        'Замена труб, гидроизоляция, укладка плитки, установка сантехники. Работы приостановлены по согласованию с заказчиком.',
      tzUpdatedAt: monthsAgo(2, 18),
      tzUpdatedById: adminId,
    });
    await seedProject4Paused(project4.id, adminId);
    markCreated(report, `проект «${SEED_PROJECT_NOVIKOVA}»`);
    seededProjects.push({ projectId: project4.id, clientId: clientNovikova.id });
  }

  if (seededProjects.length > 0) await seedActivityLog(adminId, seededProjects);
};

const createProject = async (data: {
  clientId: number;
  managerId: number;
  name: string;
  address: string;
  status: ProjectStatus;
  startDate: Date | null;
  tzText: string;
  tzUpdatedAt: Date;
  tzUpdatedById: number;
}) => {
  const project = await dbClient.project.create({
    data: {
      clientId: data.clientId,
      number: '',
      name: data.name,
      address: data.address,
      status: data.status,
      startDate: data.startDate,
      managerId: data.managerId,
      tzText: data.tzText,
      tzUpdatedAt: data.tzUpdatedAt,
      tzUpdatedById: data.tzUpdatedById,
    },
  });

  await dbClient.project.update({
    where: { id: project.id },
    data: { number: project.id.toString() },
  });

  return { ...project, number: project.id.toString() };
};

const seedProject1Finance = async (projectId: number, adminId: number) => {
  const inflowWorks1 = await dbClient.projectInflow.create({
    data: {
      projectId,
      date: monthsAgo(3, 6),
      amount: 18000,
      purpose: ProjectInflowPurpose.WORKS,
      comment: 'Аванс на работы (40%)',
      addedById: adminId,
    },
  });

  const inflowWorks2 = await dbClient.projectInflow.create({
    data: {
      projectId,
      date: monthsAgo(2, 1),
      amount: 12000,
      purpose: ProjectInflowPurpose.WORKS,
      comment: 'Второй транш на работы',
      addedById: adminId,
    },
  });

  const inflowMaterials = await dbClient.projectInflow.create({
    data: {
      projectId,
      date: monthsAgo(3, 5),
      amount: 42000,
      purpose: ProjectInflowPurpose.MATERIALS,
      comment: 'Депозит на материалы',
      addedById: adminId,
    },
  });

  const transfer = await dbClient.walletTransfer.create({
    data: {
      projectId,
      date: monthsAgo(2, 15),
      amount: 5000,
      fromWallet: WalletType.WORKS,
      toWallet: WalletType.MATERIALS,
      comment: 'Перевод на закупку плитки',
      addedById: adminId,
    },
  });

  await dbClient.activityLog.createMany({
    data: [
      {
        userId: adminId,
        projectId,
        entityType: PROJECT_INFLOW_ENTITY_TYPE,
        entityId: inflowWorks1.id,
        action: ActivityAction.CREATE,
        createdAt: monthsAgo(3, 6),
        changes: { after: { purpose: 'WORKS', amount: 18000 } },
      },
      {
        userId: adminId,
        projectId,
        entityType: PROJECT_INFLOW_ENTITY_TYPE,
        entityId: inflowWorks2.id,
        action: ActivityAction.CREATE,
        createdAt: monthsAgo(2, 1),
        changes: { after: { purpose: 'WORKS', amount: 12000 } },
      },
      {
        userId: adminId,
        projectId,
        entityType: PROJECT_INFLOW_ENTITY_TYPE,
        entityId: inflowMaterials.id,
        action: ActivityAction.CREATE,
        createdAt: monthsAgo(3, 5),
        changes: { after: { purpose: 'MATERIALS', amount: 42000 } },
      },
      {
        userId: adminId,
        projectId,
        entityType: WALLET_TRANSFER_ENTITY_TYPE,
        entityId: transfer.id,
        action: ActivityAction.CREATE,
        createdAt: monthsAgo(2, 15),
        changes: { after: { fromWallet: 'WORKS', toWallet: 'MATERIALS', amount: 5000 } },
      },
    ],
  });
};

const seedProject1Estimate = async (projectId: number) => {
  const demolition = await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Демонтаж',
      sortOrder: 1,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Демонтаж старых обоев и покрытий',
            unit: 'м²',
            quantity: 145,
            unitPrice: 85,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Демонтаж напольных покрытий',
            unit: 'м²',
            quantity: 52,
            unitPrice: 120,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 3,
            name: 'Вывоз строительного мусора',
            unit: 'рейс',
            quantity: 3,
            unitPrice: 1800,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: false,
          },
        ],
      },
    },
    include: { items: true },
  });

  const electric = await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Электрика',
      sortOrder: 2,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Штробление стен под кабель',
            unit: 'м.п.',
            quantity: 85,
            unitPrice: 90,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Монтаж электропроводки',
            unit: 'точка',
            quantity: 42,
            unitPrice: 350,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 3,
            name: 'Установка щитка и УЗО',
            unit: 'компл.',
            quantity: 1,
            unitPrice: 420,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: false,
          },
        ],
      },
    },
    include: { items: true },
  });

  await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Сантехника',
      sortOrder: 3,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Разводка труб ХВС/ГВС',
            unit: 'точка',
            quantity: 8,
            unitPrice: 950,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Монтаж коллекторного узла',
            unit: 'компл.',
            quantity: 1,
            unitPrice: 3800,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
        ],
      },
    },
  });

  await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Отделка',
      sortOrder: 4,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Штукатурка стен по маякам',
            unit: 'м²',
            quantity: 120,
            unitPrice: 22,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Укладка ламината',
            unit: 'м²',
            quantity: 48,
            unitPrice: 18,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: true,
          },
          {
            sortOrder: 3,
            name: 'Поклейка обоев',
            unit: 'м²',
            quantity: 95,
            unitPrice: 14,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: false,
          },
        ],
      },
    },
  });

  return { demolition, electric };
};

const seedProject1ActsAndExtra = async (projectId: number, adminId: number) => {
  const items = await dbClient.estimateItem.findMany({
    where: { section: { projectId } },
    orderBy: [{ sectionId: 'asc' }, { sortOrder: 'asc' }],
  });

  const agreedItems = items.filter((item) => item.status === EstimateItemStatus.AGREED);

  const act1 = await dbClient.act.create({
    data: {
      projectId,
      number: '1',
      date: monthsAgo(2, 20),
      stage: 'Демонтаж и подготовка',
      status: ActStatus.SIGNED,
      comment: 'Этап 1 выполнен полностью',
      items: {
        create: agreedItems.slice(0, 3).map((item) => ({
          estimateItemId: item.id,
          amount: Number(item.quantity) * Number(item.unitPrice),
        })),
      },
    },
  });

  const act2 = await dbClient.act.create({
    data: {
      projectId,
      number: '2',
      date: monthsAgo(1, 8),
      stage: 'Электрика и сантехника',
      status: ActStatus.SIGNED,
      items: {
        create: agreedItems.slice(3, 7).map((item) => ({
          estimateItemId: item.id,
          amount: Number(item.quantity) * Number(item.unitPrice),
        })),
      },
    },
  });

  const usedInSignedActs = new Set(agreedItems.map((item) => item.id));
  const act3Items = items.filter(
    (item) => !usedInSignedActs.has(item.id) && item.status === EstimateItemStatus.DRAFT
  );

  const act3 = await dbClient.act.create({
    data: {
      projectId,
      number: '3',
      date: daysAgo(25),
      stage: 'Отделочные работы',
      status: ActStatus.SENT,
      items: {
        create: act3Items.slice(0, 2).map((item) => ({
          estimateItemId: item.id,
          amount: Number(item.quantity) * Number(item.unitPrice),
        })),
      },
    },
  });

  await dbClient.act.create({
    data: {
      projectId,
      number: '4',
      date: daysAgo(5),
      stage: 'Финиш',
      status: ActStatus.DRAFT,
      comment: 'Черновик под следующий этап',
    },
  });

  await dbClient.extraWork.createMany({
    data: [
      {
        projectId,
        date: daysAgo(40),
        description: 'Дополнительное усиление проёма под дверь',
        unit: 'шт.',
        quantity: 1,
        unitPrice: 280,
        status: ExtraWorkStatus.PENDING,
        isVisibleToClient: true,
        includedInBudget: false,
      },
      {
        projectId,
        date: daysAgo(35),
        description: 'Установка ревизионных люков',
        unit: 'шт.',
        quantity: 2,
        unitPrice: 65,
        status: ExtraWorkStatus.AGREED,
        isVisibleToClient: true,
        includedInBudget: true,
      },
      {
        projectId,
        date: daysAgo(18),
        description: 'Перенос розетки на кухне',
        unit: 'точка',
        quantity: 1,
        unitPrice: 45,
        status: ExtraWorkStatus.DONE,
        isVisibleToClient: true,
        includedInBudget: false,
      },
      {
        projectId,
        date: daysAgo(10),
        description: 'Грунтовка стен в коридоре (доп.)',
        unit: 'м²',
        quantity: 18,
        unitPrice: 6,
        status: ExtraWorkStatus.DONE,
        isVisibleToClient: true,
        includedInBudget: true,
      },
    ],
  });

  await dbClient.activityLog.createMany({
    data: [
      {
        userId: adminId,
        projectId,
        entityType: ACT_ENTITY_TYPE,
        entityId: act1.id,
        action: ActivityAction.STATUS_CHANGE,
        createdAt: monthsAgo(2, 18),
        changes: { status: 'SIGNED', previousStatus: 'SENT' },
      },
      {
        userId: adminId,
        projectId,
        entityType: ACT_ENTITY_TYPE,
        entityId: act2.id,
        action: ActivityAction.STATUS_CHANGE,
        createdAt: monthsAgo(1, 5),
        changes: { status: 'SIGNED', previousStatus: 'SENT' },
      },
      {
        userId: adminId,
        projectId,
        entityType: ACT_ENTITY_TYPE,
        entityId: act3.id,
        action: ActivityAction.STATUS_CHANGE,
        createdAt: daysAgo(24),
        changes: { status: 'SENT', previousStatus: 'DRAFT' },
      },
    ],
  });
};

const seedProject1Receipts = async (projectId: number, adminId: number) => {
  const electricSection = await dbClient.estimateSection.findFirst({
    where: { projectId, name: 'Электрика' },
  });

  const receiptPaid = await dbClient.receipt.create({
    data: {
      projectId,
      estimateSectionId: electricSection?.id,
      date: monthsAgo(2, 10),
      title: 'Кабель ВВГнг, автоматы ABB',
      amountDue: 4200,
      comment: 'Оплачено с депозита',
      payments: {
        create: {
          date: monthsAgo(2, 10),
          amount: 4200,
          source: PaymentSource.DEPOSIT,
          addedById: adminId,
        },
      },
    },
  });

  const receiptPartial = await dbClient.receipt.create({
    data: {
      projectId,
      date: monthsAgo(1, 12),
      title: 'Плитка Kerama Marazzi, клей',
      amountDue: 6800,
      payments: {
        create: [
          {
            date: monthsAgo(1, 12),
            amount: 3000,
            source: PaymentSource.DEPOSIT,
            addedById: adminId,
          },
          {
            date: daysAgo(20),
            amount: 2000,
            source: PaymentSource.DIRECT,
            comment: 'Доплата наличными',
            addedById: adminId,
          },
        ],
      },
    },
  });

  const receiptUnpaid = await dbClient.receipt.create({
    data: {
      projectId,
      date: daysAgo(8),
      title: 'Ламинат Quick-Step, подложка',
      amountDue: 5100,
      comment: 'Ожидает оплаты',
    },
  });

  await dbClient.activityLog.create({
    data: {
      userId: adminId,
      projectId,
      entityType: RECEIPT_DEPOSIT_ENTITY_TYPE,
      entityId: receiptPaid.id,
      action: ActivityAction.CREATE,
      createdAt: monthsAgo(2, 10),
      changes: { receiptTitle: 'Кабель ВВГнг, автоматы ABB', amount: 4200 },
    },
  });

  await dbClient.activityLog.create({
    data: {
      userId: adminId,
      projectId,
      entityType: RECEIPT_DEPOSIT_ENTITY_TYPE,
      entityId: receiptPartial.id,
      action: ActivityAction.CREATE,
      createdAt: monthsAgo(1, 12),
      changes: { receiptTitle: 'Плитка Kerama Marazzi, клей', amount: 3000 },
    },
  });

  void receiptUnpaid;
};

const seedProject2Full = async (projectId: number, adminId: number) => {
  await dbClient.projectInflow.createMany({
    data: [
      {
        projectId,
        date: monthsAgo(5, 8),
        amount: 45000,
        purpose: ProjectInflowPurpose.WORKS,
        comment: 'Полная оплата работ',
        addedById: adminId,
      },
      {
        projectId,
        date: monthsAgo(5, 8),
        amount: 22000,
        purpose: ProjectInflowPurpose.MATERIALS,
        comment: 'Материалы',
        addedById: adminId,
      },
    ],
  });

  const section = await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Работы и материалы',
      sortOrder: 1,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Подготовка и покраска стен',
            unit: 'м²',
            quantity: 78,
            unitPrice: 12,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Напольное покрытие SPC',
            unit: 'м²',
            quantity: 28,
            unitPrice: 28,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 3,
            name: 'Санузел под ключ',
            unit: 'компл.',
            quantity: 1,
            unitPrice: 8500,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
        ],
      },
    },
    include: { items: true },
  });

  const act = await dbClient.act.create({
    data: {
      projectId,
      number: '1',
      date: monthsAgo(4, 1),
      status: ActStatus.SIGNED,
      stage: 'Сдача объекта',
      items: {
        create: section.items.map((item) => ({
          estimateItemId: item.id,
          amount: Number(item.quantity) * Number(item.unitPrice),
        })),
      },
    },
  });

  const receipt = await dbClient.receipt.create({
    data: {
      projectId,
      date: monthsAgo(4, 15),
      title: 'Краска, лак, расходники',
      amountDue: 1800,
      payments: {
        create: {
          date: monthsAgo(4, 15),
          amount: 1800,
          source: PaymentSource.DEPOSIT,
          addedById: adminId,
        },
      },
    },
  });

  await dbClient.extraWork.create({
    data: {
      projectId,
      date: monthsAgo(4, 5),
      description: 'Установка зеркала и полок',
      unit: 'компл.',
      quantity: 1,
      unitPrice: 120,
      status: ExtraWorkStatus.DONE,
      isVisibleToClient: true,
      includedInBudget: true,
    },
  });

  await dbClient.activityLog.create({
    data: {
      userId: adminId,
      projectId,
      entityType: ACT_ENTITY_TYPE,
      entityId: act.id,
      action: ActivityAction.STATUS_CHANGE,
      createdAt: monthsAgo(4, 1),
      changes: { status: 'SIGNED' },
    },
  });

  void receipt;
};

const seedProject3Planning = async (projectId: number, adminId: number) => {
  await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Предварительная смета',
      sortOrder: 1,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Демонтаж старой кухни',
            unit: 'компл.',
            quantity: 1,
            unitPrice: 350,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Электрика под технику',
            unit: 'точка',
            quantity: 6,
            unitPrice: 40,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: true,
          },
        ],
      },
    },
  });

  await dbClient.projectInflow.create({
    data: {
      projectId,
      date: daysAgo(30),
      amount: 5000,
      purpose: ProjectInflowPurpose.WORKS,
      comment: 'Задаток на проектирование',
      addedById: adminId,
    },
  });

  await dbClient.extraWork.create({
    data: {
      projectId,
      date: daysAgo(14),
      description: '3D-визуализация кухни',
      unit: 'шт.',
      quantity: 1,
      unitPrice: 200,
      status: ExtraWorkStatus.PENDING,
      isVisibleToClient: true,
      includedInBudget: false,
    },
  });
};

const seedProject4Paused = async (projectId: number, adminId: number) => {
  await dbClient.projectInflow.createMany({
    data: [
      {
        projectId,
        date: monthsAgo(2, 18),
        amount: 25000,
        purpose: ProjectInflowPurpose.WORKS,
        addedById: adminId,
      },
      {
        projectId,
        date: monthsAgo(2, 18),
        amount: 18000,
        purpose: ProjectInflowPurpose.MATERIALS,
        addedById: adminId,
      },
    ],
  });

  const section = await dbClient.estimateSection.create({
    data: {
      projectId,
      name: 'Ванная',
      sortOrder: 1,
      items: {
        create: [
          {
            sortOrder: 1,
            name: 'Демонтаж и подготовка',
            unit: 'м²',
            quantity: 12,
            unitPrice: 25,
            status: EstimateItemStatus.AGREED,
            isVisibleToClient: true,
          },
          {
            sortOrder: 2,
            name: 'Гидроизоляция и плитка',
            unit: 'м²',
            quantity: 28,
            unitPrice: 45,
            status: EstimateItemStatus.DRAFT,
            isVisibleToClient: true,
          },
        ],
      },
    },
    include: { items: true },
  });

  await dbClient.act.create({
    data: {
      projectId,
      number: '1',
      date: monthsAgo(1, 25),
      status: ActStatus.DRAFT,
      stage: 'Подготовительные работы',
      items: {
        create: {
          estimateItemId: section.items[0].id,
          amount: Number(section.items[0].quantity) * Number(section.items[0].unitPrice),
        },
      },
    },
  });

  await dbClient.receipt.create({
    data: {
      projectId,
      date: monthsAgo(1, 20),
      title: 'Трубы Rehau, фитинги',
      amountDue: 3200,
      payments: {
        create: {
          date: monthsAgo(1, 20),
          amount: 3200,
          source: PaymentSource.DEPOSIT,
          addedById: adminId,
        },
      },
    },
  });
};

const seedActivityLog = async (
  adminId: number,
  projects: { projectId: number; clientId: number }[]
) => {
  const tzEntries = projects.map((p, index) => ({
    userId: adminId,
    projectId: p.projectId,
    entityType: PROJECT_TZ_ENTITY_TYPE,
    entityId: p.projectId,
    action: ActivityAction.UPDATE,
    createdAt: monthsAgo(4 - index, 10 + index),
    changes: { summary: 'Обновление текста ТЗ' },
  }));

  const misc = [
    {
      userId: adminId,
      projectId: projects[0].projectId,
      entityType: PROJECT_TZ_ENTITY_TYPE,
      entityId: projects[0].projectId,
      action: ActivityAction.UPDATE,
      createdAt: daysAgo(60),
      changes: { summary: 'Уточнение сроков' },
    },
    {
      userId: adminId,
      projectId: projects[2].projectId,
      entityType: PROJECT_TZ_ENTITY_TYPE,
      entityId: projects[2].projectId,
      action: ActivityAction.CREATE,
      createdAt: daysAgo(15),
      changes: {},
    },
  ];

  await dbClient.activityLog.createMany({ data: [...tzEntries, ...misc] });
};
