import { dbClient } from '@/data/shared/dbClient';

export const clearDatabase = async (): Promise<void> => {
  await dbClient.activityLog.deleteMany();
  await dbClient.file.deleteMany();
  await dbClient.payment.deleteMany();
  await dbClient.actItem.deleteMany();
  await dbClient.act.deleteMany();
  await dbClient.extraWork.deleteMany();
  await dbClient.receipt.deleteMany();
  await dbClient.estimateItem.deleteMany();
  await dbClient.estimateSection.deleteMany();
  await dbClient.walletTransfer.deleteMany();
  await dbClient.projectInflow.deleteMany();
  await dbClient.project.deleteMany();
  await dbClient.client.deleteMany();
  await dbClient.session.deleteMany();
  await dbClient.account.deleteMany();
  await dbClient.verification.deleteMany();
  await dbClient.rateLimit.deleteMany();
  await dbClient.user.deleteMany();
};
