import { Prisma } from '@prisma/client';
import { dbClient } from '@/data/shared/dbClient';
import {
  formatItemDeleteBlockedByActs,
  formatSectionDeleteBlockedByActs,
} from '@/domain/estimates/helpers/formatDeleteBlockedByActs';
import {
  EstimateItemDeleteBlockedError,
  EstimateSectionDeleteBlockedError,
} from '@/data/estimates/helpers/estimateDeleteBlockedError';
import { getActNumbersForEstimateItems } from '@/data/estimates/helpers/getActNumbersForEstimateItems';

interface IMapItemDeleteErrorParams {
  kind: 'item';
  estimateItemId: number;
}

interface IMapSectionDeleteErrorParams {
  kind: 'section';
  sectionId: number;
}

type IMapEstimateDeleteErrorParams = IMapItemDeleteErrorParams | IMapSectionDeleteErrorParams;

const isForeignKeyViolation = (error: unknown): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003';

export const mapEstimateDeleteError = async (
  error: unknown,
  params: IMapEstimateDeleteErrorParams,
): Promise<string | null> => {
  if (error instanceof EstimateItemDeleteBlockedError)
    return formatItemDeleteBlockedByActs(error.actNumbers);

  if (error instanceof EstimateSectionDeleteBlockedError)
    return formatSectionDeleteBlockedByActs(error.actNumbers);

  if (!isForeignKeyViolation(error)) return null;

  if (params.kind === 'item') {
    const actNumbers = await getActNumbersForEstimateItems([params.estimateItemId]);
    return formatItemDeleteBlockedByActs(actNumbers);
  }

  const section = await dbClient.estimateSection.findUnique({
    where: { id: params.sectionId },
    select: { items: { select: { id: true } } },
  });

  const itemIds = section?.items.map((item) => item.id) ?? [];
  const actNumbers = await getActNumbersForEstimateItems(itemIds);
  return formatSectionDeleteBlockedByActs(actNumbers);
};
