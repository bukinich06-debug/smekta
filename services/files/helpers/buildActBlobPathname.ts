import { sanitizeFileName } from './sanitizeFileName';

export const buildActBlobPathname = (projectId: number, actId: number, originalName: string): string => {
  const safeName = sanitizeFileName(originalName);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `projects/${projectId}/acts/${actId}/${suffix}-${safeName}`;
};
