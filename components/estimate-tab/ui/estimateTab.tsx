'use client';

import { useState } from 'react';
import { useEstimate } from '../hooks/useEstimate';
import { EstimateSection } from './estimateSection';
import { AddSectionForm } from './addSectionForm';
import { formatMoney } from '../helpers/formatMoney';

interface IEstimateTabProps {
  projectId: number;
}

export const EstimateTab = ({ projectId }: IEstimateTabProps) => {
  const { 
    data, 
    loading, 
    error, 
    success, 
    addSection, 
    editSection, 
    removeSection, 
    addItem, 
    editItem, 
    removeItem, 
    toggleVisibility, 
    toggleStatus, 
    clearMessages 
  } = useEstimate(projectId);
  const [showAddSection, setShowAddSection] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={clearMessages} className="ml-2 text-red-900 font-bold">×</button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
          <button onClick={clearMessages} className="ml-2 text-green-900 font-bold">×</button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Смета проекта</h2>
        <button
          onClick={() => setShowAddSection(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Добавить раздел
        </button>
      </div>

      {showAddSection && (
        <AddSectionForm
          onAdd={async (name) => {
            await addSection(name);
            setShowAddSection(false);
          }}
          onCancel={() => setShowAddSection(false)}
        />
      )}

      {data && data.sections.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>Смета пока пуста. Добавьте разделы и позиции.</p>
        </div>
      )}

      {data && data.sections.map((section) => (
        <EstimateSection
          key={section.id}
          section={section}
          onEditSection={editSection}
          onDeleteSection={removeSection}
          onAddItem={addItem}
          onEditItem={editItem}
          onDeleteItem={removeItem}
          onToggleVisibility={toggleVisibility}
          onToggleStatus={toggleStatus}
        />
      ))}

      {data && data.sections.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Итого по смете:</span>
              <span className="text-2xl font-bold text-blue-600">{formatMoney(data.total)}</span>
            </div>
          </div>
          
          {data.hiddenTotal > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Для заказчика:</span>
                  <span className="text-xl font-bold text-blue-600">{formatMoney(data.visibleTotal)}</span>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Только для администратора:</span>
                  <span className="text-xl font-bold text-amber-600">{formatMoney(data.hiddenTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
