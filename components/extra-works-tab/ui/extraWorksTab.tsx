'use client';

import { useExtraWorks } from '../hooks/useExtraWorks';
import { ExtraWorksTotals } from './extraWorksTotals';
import { ExtraWorkForm } from './extraWorkForm';
import { ExtraWorkRow } from './extraWorkRow';

interface IExtraWorksTabProps {
  projectId: number;
}

export const ExtraWorksTab = ({ projectId }: IExtraWorksTabProps) => {
  const {
    data,
    loading,
    actionLoading,
    error,
    success,
    showCreateForm,
    setShowCreateForm,
    editingWork,
    setEditingWork,
    submitCreate,
    submitUpdate,
    removeWork,
    handleToggleStatus,
    handleToggleVisibility,
    handleToggleBudget,
    clearMessages,
  } = useExtraWorks(projectId);

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
        <h2 className="text-xl font-semibold text-gray-900">Дополнительные работы</h2>
        {!showCreateForm && !editingWork && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Добавить допработу
          </button>
        )}
      </div>

      <ExtraWorksTotals total={data.total} budgetTotal={data.budgetTotal} />

      {showCreateForm && (
        <ExtraWorkForm
          loading={actionLoading}
          submitLabel="Добавить"
          onSubmit={submitCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {editingWork && (
        <ExtraWorkForm
          initial={editingWork}
          loading={actionLoading}
          submitLabel="Сохранить"
          onSubmit={(values) => submitUpdate(editingWork.id, values)}
          onCancel={() => setEditingWork(null)}
        />
      )}

      {data.items.length === 0 && !showCreateForm && (
        <div className="text-center text-gray-500 py-12">
          <p>Дополнительных работ пока нет</p>
        </div>
      )}

      {data.items
        .filter((work) => editingWork?.id !== work.id)
        .map((work) => (
          <ExtraWorkRow
            key={work.id}
            work={work}
            loading={actionLoading}
            onEdit={setEditingWork}
            onDelete={removeWork}
            onToggleStatus={handleToggleStatus}
            onToggleVisibility={handleToggleVisibility}
            onToggleBudget={handleToggleBudget}
          />
        ))}
    </div>
  );
};
