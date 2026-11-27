import type { ActStatus } from '@prisma/client';

export const CLIENT_VISIBLE_ACT_STATUSES: ReadonlySet<ActStatus> = new Set(['SENT', 'SIGNED']);
