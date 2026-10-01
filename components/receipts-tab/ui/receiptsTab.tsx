'use client';

import { useReceipts } from '../hooks/useReceipts';
import { ReceiptsTotals } from './receiptsTotals';
import { ReceiptsFilters } from './receiptsFilters';
import { ReceiptForm } from './receiptForm';
import { ReceiptRow } from './receiptRow';

interface IReceiptsTabProps {
  projectId: number;
}

export const ReceiptsTab = ({ projectId }: IReceiptsTabProps) => {
  const {
    data,
    loading,
    actionLoading,
    error,
    success,
    statusFilter,
    setStatusFilter,
    dateOrder,
    setDateOrder,
    displayedReceipts,
    showCreateForm,
    setShowCreateForm,
    editingReceipt,
    setEditingReceipt,
    submitCreate,
    submitUpdate,
    removeReceipt,
    handlePayFull,
    handlePayPartial,
    handleDeletePayment,
    clearMessages,
  } = useReceipts(projectId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button type="button" onClick={clearMessages} className="ml-2 text-red-900 font-bold">×</button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
          <button type="button" onClick={clearMessages} className="ml-2 text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Чеки и оплаты</h2>
        {!showCreateForm && !editingReceipt && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Добавить чек
          </button>
        )}
      </div>

      <ReceiptsTotals
        totalDue={data.totalDue}
        totalPaid={data.totalPaid}
        totalRemainder={data.totalRemainder}
      />

      <ReceiptsFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateOrder={dateOrder}
        onDateOrderChange={setDateOrder}
      />

      {showCreateForm && (
        <ReceiptForm
          sections={data.sections}
          loading={actionLoading}
          onSubmit={submitCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingReceipt && (
        <ReceiptForm
          sections={data.sections}
          initial={editingReceipt}
          loading={actionLoading}
          onSubmit={submitUpdate}
          onCancel={() => setEditingReceipt(null)}
        />
      )}

      {displayedReceipts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>Чеков пока нет</p>
        </div>
      )}

      {displayedReceipts.map((receipt) => (
        <ReceiptRow
          key={receipt.id}
          receipt={receipt}
          loading={actionLoading}
          onEdit={setEditingReceipt}
          onDelete={removeReceipt}
          onPayFull={handlePayFull}
          onPayPartial={handlePayPartial}
          onDeletePayment={handleDeletePayment}
        />
      ))}
    </div>
  );
};
