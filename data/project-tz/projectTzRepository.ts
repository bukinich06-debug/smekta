import { dbClient } from '@/data/shared/dbClient';
import type { IProjectTzRepository, IProjectTz, IProjectTzHistoryItem } from '@/domain/project-tz';
import { PROJECT_TZ_ENTITY_TYPE } from '@/domain/project-tz';
import { ActivityAction } from '@prisma/client';

const mapProjectTz = (project: {
  id: number;
  tzText: string | null;
  tzUpdatedAt: Date | null;
  tzUpdatedBy: { name: string } | null;
}): IProjectTz => ({
  projectId: project.id,
  text: project.tzText,
  updatedAt: project.tzUpdatedAt,
  updatedByName: project.tzUpdatedBy?.name ?? null,
});

export const projectTzRepository: IProjectTzRepository = {
  async getByProjectId(projectId: number): Promise<IProjectTz | null> {
    const project = await dbClient.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        tzText: true,
        tzUpdatedAt: true,
        tzUpdatedBy: { select: { name: true } },
      },
    });

    if (!project) return null;

    return mapProjectTz(project);
  },

  async getByClientUserId(userId: number): Promise<IProjectTz | null> {
    const client = await dbClient.client.findFirst({
      where: { userId },
      include: {
        projects: {
          take: 1,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            tzText: true,
            tzUpdatedAt: true,
            tzUpdatedBy: { select: { name: true } },
          },
        },
      },
    });

    const project = client?.projects[0];
    if (!project) return null;

    return mapProjectTz(project);
  },

  async updateText(projectId: number, text: string, userId: number): Promise<IProjectTz> {
    const now = new Date();

    const project = await dbClient.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId },
        data: {
          tzText: text,
          tzUpdatedAt: now,
          tzUpdatedById: userId,
        },
        select: {
          id: true,
          tzText: true,
          tzUpdatedAt: true,
          tzUpdatedBy: { select: { name: true } },
        },
      });

      await tx.activityLog.create({
        data: {
          userId,
          projectId,
          entityType: PROJECT_TZ_ENTITY_TYPE,
          entityId: projectId,
          action: ActivityAction.UPDATE,
          changes: { field: 'tzText' },
        },
      });

      return updated;
    });

    return mapProjectTz(project);
  },

  async listHistory(projectId: number): Promise<IProjectTzHistoryItem[]> {
    const rows = await dbClient.activityLog.findMany({
      where: {
        projectId,
        entityType: PROJECT_TZ_ENTITY_TYPE,
        action: ActivityAction.UPDATE,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      authorName: row.user.name,
    }));
  },
};
