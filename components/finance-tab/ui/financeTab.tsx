'use client';

import { useFinanceTab } from '../hooks/useFinanceTab';
import { FinanceSummary } from './financeSummary';
import { WalletBalances } from './walletBalances';
import { InflowsPanel } from './inflowsPanel';
import { LedgerPanel } from './ledgerPanel';
import { FinanceHistoryList } from './financeHistoryList';

interface IFinanceTabProps {
  projectId: number;
}

export const FinanceTab = ({ projectId }: IFinanceTabProps) => {
  const finance = useFinanceTab(projectId);

  if (finance.loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!finance.data) return null;

  return (
    <div>
      {finance.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {finance.error}
          <button type="button" onClick={finance.clearMessages} className="ml-2 text-red-900 font-bold">
            ×
          </button>
        </div>
      )}

      {finance.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {finance.success}
          <button type="button" onClick={finance.clearMessages} className="ml-2 text-green-900 font-bold">
            ×
          </button>
        </div>
      )}

      <FinanceSummary summary={finance.data.summary} showStillNeeded />
      <WalletBalances summary={finance.data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InflowsPanel
          readOnly={false}
          inflows={finance.data.inflows}
          transfers={finance.data.transfers}
          actionLoading={finance.actionLoading}
          showInflowForm={finance.showInflowForm}
          showTransferForm={finance.showTransferForm}
          editingInflow={finance.editingInflow}
          editingTransfer={finance.editingTransfer}
          onShowInflowForm={() => {
            finance.onCancelForms();
            finance.setShowInflowForm(true);
          }}
          onShowTransferForm={() => {
            finance.onCancelForms();
            finance.setShowTransferForm(true);
          }}
          onCancelForms={finance.onCancelForms}
          onCreateInflow={finance.submitCreateInflow}
          onUpdateInflow={finance.submitUpdateInflow}
          onDeleteInflow={finance.submitDeleteInflow}
          onCreateTransfer={finance.submitCreateTransfer}
          onUpdateTransfer={finance.submitUpdateTransfer}
          onDeleteTransfer={finance.submitDeleteTransfer}
          onEditInflow={(row) => {
            finance.onCancelForms();
            finance.setEditingInflow(row);
          }}
          onEditTransfer={(row) => {
            finance.onCancelForms();
            finance.setEditingTransfer(row);
          }}
        />

        <LedgerPanel ledger={finance.data.ledger} dueExtraWorks={finance.data.dueExtraWorks} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">История изменений</h3>
        <FinanceHistoryList items={finance.history} />
      </div>
    </div>
  );
};
