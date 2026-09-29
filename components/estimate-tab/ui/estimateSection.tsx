'use client';

import { useState } from 'react';
import type { IEstimateSectionWithItems } from '@/domain/estimates';
import { EstimateItem } from './estimateItem';
import { AddItemForm } from './addItemForm';
import { formatMoney } from '../helpers/formatMoney';

interface IEstimateSectionProps {
  section: IEstimateSectionWithItems;
  onEditSection: (id: number, name: string) => Promise<void>;
  onDeleteSection: (id: number) => Promise<void>;
  onAddItem: (sectionId: number, itemData: {
    name: string;
    unit: string;
    quantity: string;
    unitPrice: string;
    comment?: string;
  }) => Promise<void>;
  onEditItem: (id: number, itemData: {
    name?: string;
    unit?: string;
    quantity?: string;
    unitPrice?: string;
    comment?: string;
    status?: 'DRAFT' | 'AGREED';
    isVisibleToClient?: boolean;
  }) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
}

export const EstimateSection = ({
  section,
  onEditSection,
  onDeleteSection,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: IEstimateSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);
  const [showAddItem, setShowAddItem] = useState(false);

  const handleSaveEdit = async () => {
    if (editName.trim()) {
      await onEditSection(section.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Удалить раздел "${section.name}"? Все позиции в разделе также будут удалены.`)) {
      await onDeleteSection(section.id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6">
      <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Сохранить
            </button>
            <button
              onClick={() => {
                setEditName(section.name);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Отмена
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
              <span className="text-sm text-gray-600">Итого: {formatMoney(section.total)}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddItem(true)}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Добавить позицию
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                Переименовать
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Удалить раздел
              </button>
            </div>
          </>
        )}
      </div>

      {showAddItem && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <AddItemForm
            sectionId={section.id}
            onAdd={async (itemData) => {
              await onAddItem(section.id, itemData);
              setShowAddItem(false);
            }}
            onCancel={() => setShowAddItem(false)}
          />
        </div>
      )}

      {section.items.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Раздел пока пуст. Добавьте позиции.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-12">№</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Наименование</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-24">Ед. изм.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-24">Кол-во</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-32">Цена</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 w-32">Сумма</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Комментарий</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 w-28">Статус</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 w-28">Видим для клиента</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-700 w-24">Действия</th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, index) => (
                <EstimateItem
                  key={item.id}
                  item={item}
                  index={index + 1}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
