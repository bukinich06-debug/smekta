import { sanitizeFileName } from './sanitizeFileName';

export const buildReceiptBlobPathname = (
  projectId: number,
  receiptId: number,
  originalName: string
): string => {
  const safeName = sanitizeFileName(originalName);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `projects/${projectId}/receipts/${receiptId}/${suffix}-${safeName}`;
};
