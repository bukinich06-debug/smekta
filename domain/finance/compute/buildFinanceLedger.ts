import { getExtraWorkAmount } from '@/domain/extra-works';
import { getInflowPurposeLabel, getWalletLabel } from '../helpers/getPurposeLabel';
import { roundMoney } from '../helpers/roundMoney';
import type {
  IComputeProjectFinanceOptions,
  IFinanceDueExtraWork,
  IFinanceLedgerRow,
  IProjectFinanceInput,
} from '../types';

interface ILedgerEvent {
  sortKey: string;
  date: Date;
  row: IFinanceLedgerRow;
}

const extraVisible = (
  row: IProjectFinanceInput['extraWorks'][number],
  clientView: boolean
): boolean => !clientView || row.isVisibleToClient;

export const buildFinanceLedger = (
  input: IProjectFinanceInput,
  options: IComputeProjectFinanceOptions = {}
): { ledger: IFinanceLedgerRow[]; dueExtraWorks: IFinanceDueExtraWork[] } => {
  const clientView = options.clientView === true;
  const events: ILedgerEvent[] = [];
  const dueExtraWorks: IFinanceDueExtraWork[] = [];

  for (const inflow of input.inflows) {
    events.push({
      sortKey: `inflow-${inflow.id}`,
      date: inflow.date,
      row: {
        id: `inflow-${inflow.id}`,
        date: inflow.date,
        label: `Поступление: ${getInflowPurposeLabel(inflow.purpose)}`,
        amount: inflow.amount,
        balanceAfter: 0,
        kind: 'inflow',
      },
    });
  }

  for (const transfer of input.transfers) {
    events.push({
      sortKey: `transfer-${transfer.id}-out`,
      date: transfer.date,
      row: {
        id: `transfer-out-${transfer.id}`,
        date: transfer.date,
        label: `Перевод из «${getWalletLabel(transfer.fromWallet)}»`,
        amount: -transfer.amount,
        balanceAfter: 0,
        kind: 'transfer_out',
      },
    });
    events.push({
      sortKey: `transfer-${transfer.id}-in`,
      date: transfer.date,
      row: {
        id: `transfer-in-${transfer.id}`,
        date: transfer.date,
        label: `Перевод в «${getWalletLabel(transfer.toWallet)}»`,
        amount: transfer.amount,
        balanceAfter: 0,
        kind: 'transfer_in',
      },
    });
  }

  for (const act of input.acts) {
    if (act.status !== 'SIGNED') continue;

    events.push({
      sortKey: `act-${act.id}`,
      date: act.date,
      row: {
        id: `act-${act.id}`,
        date: act.date,
        label: `Акт №${act.number} (подписан)`,
        amount: -act.totalAmount,
        balanceAfter: 0,
        kind: 'act',
      },
    });
  }

  for (const payment of input.payments) {
    const paymentAmount = Number(payment.amount);
    const fromDeposit = payment.source === 'DEPOSIT';

    events.push({
      sortKey: `payment-${payment.id}`,
      date: payment.date,
      row: {
        id: `payment-${payment.id}`,
        date: payment.date,
        label: fromDeposit
          ? `Зачёт из депозита: ${payment.receiptTitle}`
          : `Прямая оплата чека: ${payment.receiptTitle}`,
        amount: fromDeposit ? -paymentAmount : 0,
        balanceAfter: 0,
        kind: fromDeposit ? 'payment_deposit' : 'payment_direct',
      },
    });
  }

  for (const row of input.extraWorks) {
    if (!extraVisible(row, clientView)) continue;
    if (row.status !== 'AGREED') continue;

    const amount = getExtraWorkAmount(row.quantity, row.unitPrice);

    if (!row.includedInBudget) {
      dueExtraWorks.push({
        id: row.id,
        date: row.date,
        description: row.description,
        amount,
      });
      continue;
    }

    events.push({
      sortKey: `extra-${row.id}`,
      date: row.date,
      row: {
        id: `extra-${row.id}`,
        date: row.date,
        label: `Допработа (в бюджете): ${row.description}`,
        amount: -amount,
        balanceAfter: 0,
        kind: 'extra_work',
      },
    });
  }

  events.sort((a, b) => {
    const timeDiff = a.date.getTime() - b.date.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.sortKey.localeCompare(b.sortKey);
  });

  let balance = 0;
  const ledger: IFinanceLedgerRow[] = [];

  for (const event of events) {
    balance = roundMoney(balance + event.row.amount);
    ledger.push({ ...event.row, balanceAfter: balance });
  }

  return { ledger, dueExtraWorks };
};
