export interface IProjectTz {
  projectId: number;
  text: string | null;
  updatedAt: Date | null;
  updatedByName: string | null;
}

export interface IProjectTzHistoryItem {
  id: number;
  createdAt: Date;
  authorName: string;
}
