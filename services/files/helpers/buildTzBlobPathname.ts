import { sanitizeFileName } from './sanitizeFileName';

export const buildTzBlobPathname = (projectId: number, originalName: string): string => {
  const safeName = sanitizeFileName(originalName);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `projects/${projectId}/tz/${suffix}-${safeName}`;
};
