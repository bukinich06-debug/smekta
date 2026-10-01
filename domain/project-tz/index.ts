export type { IProjectTz, IProjectTzHistoryItem } from './types';
export { PROJECT_TZ_ENTITY_TYPE, MAX_PROJECT_TZ_LENGTH } from './constants';
export { validateProjectTzText } from './validation/validateProjectTzText';

import type { IProjectTz, IProjectTzHistoryItem } from './types';

export interface IProjectTzRepository {
  getByProjectId(projectId: number): Promise<IProjectTz | null>;
  getByClientUserId(userId: number): Promise<IProjectTz | null>;
  updateText(projectId: number, text: string, userId: number): Promise<IProjectTz>;
  listHistory(projectId: number): Promise<IProjectTzHistoryItem[]>;
}
