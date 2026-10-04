import { dbClient } from '@/data/shared/dbClient';

export const hasSeedBlockingData = async (): Promise<boolean> => {
  const [userCount, projectCount] = await Promise.all([
    dbClient.user.count(),
    dbClient.project.count(),
  ]);

  return userCount > 0 || projectCount > 0;
};
