'use client';

import type { IClientProjectFinance } from '@/domain/finance';
import {
  FinanceSummary,
  WalletBalances,
  InflowsPanel,
  LedgerPanel,
} from '@/components/finance-tab';

interface IClientFinanceTabProps {
  data: IClientProjectFinance;
}

export const ClientFinanceTab = ({ data }: IClientFinanceTabProps) => (
  <div>
    <FinanceSummary summary={data.summary} />
    <WalletBalances summary={data.summary} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <InflowsPanel
        readOnly
        inflows={data.inflows}
        transfers={data.transfers}
        actionLoading={false}
        showInflowForm={false}
        showTransferForm={false}
        editingInflow={null}
        editingTransfer={null}
        onShowInflowForm={() => {}}
        onShowTransferForm={() => {}}
        onCancelForms={() => {}}
        onCreateInflow={async () => {}}
        onUpdateInflow={async () => {}}
        onDeleteInflow={async () => {}}
        onCreateTransfer={async () => {}}
        onUpdateTransfer={async () => {}}
        onDeleteTransfer={async () => {}}
        onEditInflow={() => {}}
        onEditTransfer={() => {}}
      />

      <LedgerPanel ledger={data.ledger} dueExtraWorks={data.dueExtraWorks} />
    </div>
  </div>
);
