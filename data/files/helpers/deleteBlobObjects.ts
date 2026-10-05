import { del } from '@vercel/blob';

export const deleteBlobObjects = async (storageKeys: string[]): Promise<void> => {
  if (storageKeys.length === 0) return;

  await del(storageKeys);
};
