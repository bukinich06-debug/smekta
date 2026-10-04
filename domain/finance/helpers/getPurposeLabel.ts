import type { ProjectInflowPurpose, WalletType } from '@prisma/client';

export const getInflowPurposeLabel = (purpose: ProjectInflowPurpose): string => {
  if (purpose === 'WORKS') return 'Аванс на работы';
  return 'Депозит на материалы';
};

export const getWalletLabel = (wallet: WalletType): string => {
  if (wallet === 'WORKS') return 'Работы';
  return 'Материалы';
};
