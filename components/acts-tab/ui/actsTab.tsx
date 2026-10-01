'use client';

import { useActs } from '../hooks/useActs';
import { ActForm } from './actForm';
import { ActRow } from './actRow';

interface IActsTabProps {
  projectId: number;
}

export const ActsTab = ({ projectId }: IActsTabProps) => {
  const {
    data,
    loading,
    actionLoading,
    error,
    success,
    showCreateForm,
    setShowCreateForm,
    editingAct,
    setEditingAct,
    submitCreate,
    submitUpdate,
    removeAct,
    changeStatus,
    clearMessages,
  } = useActs(projectId);

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
          <button type="button" onClick={clearMessages} className="ml-2 text-red-900 font-bold">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
          <button type="button" onClick={clearMessages} className="ml-2 text-green-900 font-bold">
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Акты выполненных работ</h2>
        {!showCreateForm && !editingAct && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Создать акт
          </button>
        )}
      </div>

      {showCreateForm && (
        <ActForm
          suggestedNumber={data.suggestedNumber}
          pickerSections={data.pickerSections}
          loading={actionLoading}
          onSubmit={submitCreate}
          onCancel={() => setShowCreateForm(false)}
          submitLabel="Создать"
        />
      )}

      {editingAct && (
        <ActForm
          suggestedNumber={data.suggestedNumber}
          pickerSections={data.pickerSections}
          initial={editingAct}
          loading={actionLoading}
          onSubmit={submitUpdate}
          onCancel={() => setEditingAct(null)}
          submitLabel="Сохранить"
        />
      )}

      {data.acts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>Актов пока нет</p>
        </div>
      )}

      {data.acts.map((act) => (
        <ActRow
          key={act.id}
          act={act}
          loading={actionLoading}
          onEdit={(row) => {
            const full = data.acts.find((item) => item.id === row.id);
            if (full) setEditingAct(full);
          }}
          onDelete={removeAct}
          onStatusChange={changeStatus}
        />
      ))}
    </div>
  );
};
