import { dbClient } from '@/data/shared/dbClient';
import { deleteBlobObjects } from './deleteBlobObjects';

const listStorageKeysByReceiptId = async (receiptId: number): Promise<string[]> => {
  const rows = await dbClient.file.findMany({
    where: { receiptId, tab: 'RECEIPTS' },
    select: { storageKey: true },
  });

  return rows.map((row) => row.storageKey);
};

const listStorageKeysByPaymentId = async (paymentId: number): Promise<string[]> => {
  const rows = await dbClient.file.findMany({
    where: { paymentId, tab: 'RECEIPTS' },
    select: { storageKey: true },
  });

  return rows.map((row) => row.storageKey);
};

export const purgeBlobFilesForReceipt = async (receiptId: number): Promise<void> => {
  const storageKeys = await listStorageKeysByReceiptId(receiptId);
  await deleteBlobObjects(storageKeys);
};

export const purgeBlobFilesForPayment = async (paymentId: number): Promise<void> => {
  const storageKeys = await listStorageKeysByPaymentId(paymentId);
  await deleteBlobObjects(storageKeys);
};

const listStorageKeysByActId = async (actId: number): Promise<string[]> => {
  const rows = await dbClient.file.findMany({
    where: { actId, tab: 'ACTS' },
    select: { storageKey: true },
  });

  return rows.map((row) => row.storageKey);
};

export const purgeBlobFilesForAct = async (actId: number): Promise<void> => {
  const storageKeys = await listStorageKeysByActId(actId);
  await deleteBlobObjects(storageKeys);
};

const listStorageKeysByProjectIdTz = async (projectId: number): Promise<string[]> => {
  const rows = await dbClient.file.findMany({
    where: { projectId, tab: 'TZ' },
    select: { storageKey: true },
  });

  return rows.map((row) => row.storageKey);
};

export const purgeBlobFilesForProjectTz = async (projectId: number): Promise<void> => {
  const storageKeys = await listStorageKeysByProjectIdTz(projectId);
  await deleteBlobObjects(storageKeys);
};

const listStorageKeysByProjectIdPhotos = async (projectId: number): Promise<string[]> => {
  const rows = await dbClient.file.findMany({
    where: { projectId, tab: 'PHOTOS' },
    select: { storageKey: true },
  });

  return rows.map((row) => row.storageKey);
};

export const purgeBlobFilesForProjectPhotos = async (projectId: number): Promise<void> => {
  const storageKeys = await listStorageKeysByProjectIdPhotos(projectId);
  await deleteBlobObjects(storageKeys);
};
