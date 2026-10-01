import { getExtraWorkAmount } from '@/domain/extra-works';
import { roundMoney } from '../helpers/roundMoney';
import type {
  IComputeProjectFinanceOptions,
  IProjectFinanceInput,
  IProjectFinanceSummary,
} from '../types';

const sumEstimate = (
  sections: IProjectFinanceInput['estimateSections'],
  clientView: boolean
): number => {
  let sum = 0;

  for (const section of sections) {
    for (const item of section.items) {
      if (clientView && !item.isVisibleToClient) continue;
      sum += Number(item.quantity) * Number(item.unitPrice);
    }
  }

  return roundMoney(sum);
};

const extraVisible = (
  row: IProjectFinanceInput['extraWorks'][number],
  clientView: boolean
): boolean => !clientView || row.isVisibleToClient;

export const computeProjectFinance = (
  input: IProjectFinanceInput,
  options: IComputeProjectFinanceOptions = {}
): IProjectFinanceSummary => {
  const clientView = options.clientView === true;

  let budgetExtra = 0;
  let masteredExtra = 0;
  let dueExtraWithoutBudget = 0;

  for (const row of input.extraWorks) {
    if (!extraVisible(row, clientView)) continue;
    if (row.status !== 'AGREED') continue;

    const amount = getExtraWorkAmount(row.quantity, row.unitPrice);

    if (row.includedInBudget) budgetExtra += amount;
    else {
      masteredExtra += amount;
      dueExtraWithoutBudget += amount;
    }
  }

  const estimateTotal = roundMoney(sumEstimate(input.estimateSections, clientView) + budgetExtra);

  let worksInflows = 0;
  let materialsInflows = 0;
  let receivedTotal = 0;

  for (const inflow of input.inflows) {
    receivedTotal += inflow.amount;
    if (inflow.purpose === 'WORKS') worksInflows += inflow.amount;
    else materialsInflows += inflow.amount;
  }

  let worksNetInflows = worksInflows;
  let worksWallet = worksInflows;
  let materialsWallet = materialsInflows;

  for (const transfer of input.transfers) {
    if (transfer.fromWallet === 'WORKS') {
      worksWallet -= transfer.amount;
      worksNetInflows -= transfer.amount;
    } else materialsWallet -= transfer.amount;

    if (transfer.toWallet === 'WORKS') {
      worksWallet += transfer.amount;
      worksNetInflows += transfer.amount;
    } else materialsWallet += transfer.amount;
  }

  let actsMastered = 0;

  for (const act of input.acts) {
    if (act.status !== 'SIGNED') continue;
    worksWallet -= act.totalAmount;
    actsMastered += act.totalAmount;
  }

  for (const row of input.extraWorks) {
    if (!extraVisible(row, clientView)) continue;
    if (row.status !== 'AGREED' || !row.includedInBudget) continue;

    const amount = getExtraWorkAmount(row.quantity, row.unitPrice);
    worksWallet -= amount;
    masteredExtra += amount;
  }

  let paymentsMastered = 0;

  for (const payment of input.payments) {
    const amount = Number(payment.amount);
    paymentsMastered += amount;
    if (payment.source === 'DEPOSIT') materialsWallet -= amount;
  }

  worksWallet = roundMoney(worksWallet);
  materialsWallet = roundMoney(materialsWallet);

  const masteredTotal = roundMoney(actsMastered + paymentsMastered + masteredExtra);
  const balanceOnHand = roundMoney(worksWallet + materialsWallet);
  const worksShortage = worksWallet < 0 ? roundMoney(-worksWallet) : 0;
  const dueNow = roundMoney(dueExtraWithoutBudget + worksShortage);

  const stillNeededForWorks = roundMoney(Math.max(0, estimateTotal - roundMoney(worksNetInflows)));

  return {
    estimateTotal,
    receivedTotal: roundMoney(receivedTotal),
    masteredTotal,
    balanceOnHand,
    dueNow,
    stillNeededForWorks,
    worksWalletBalance: worksWallet,
    materialsWalletBalance: materialsWallet,
  };
};
