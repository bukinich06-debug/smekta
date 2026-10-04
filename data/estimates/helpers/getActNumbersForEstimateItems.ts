import { dbClient } from '@/data/shared/dbClient';

export const getActNumbersForEstimateItems = async (estimateItemIds: number[]): Promise<string[]> => {
  if (estimateItemIds.length === 0) return [];

  const rows = await dbClient.actItem.findMany({
    where: { estimateItemId: { in: estimateItemIds } },
    select: { act: { select: { number: true } } },
  });

  const numbers = rows.map((row) => row.act.number);
  return [...new Set(numbers)].sort((a, b) => a.localeCompare(b, 'ru'));
};
