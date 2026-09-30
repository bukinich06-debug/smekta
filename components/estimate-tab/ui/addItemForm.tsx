'use client';

import { useState } from 'react';

interface IAddItemFormProps {
  sectionId: number;
  onAdd: (itemData: {
    name: string;
    unit: string;
    quantity: string;
    unitPrice: string;
    comment?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const AddItemForm = ({ onAdd, onCancel }: IAddItemFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    quantity: '1',
    unitPrice: '0',
    comment: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.unit.trim()) return;
    
    setSaving(true);
    await onAdd({
      name: formData.name.trim(),
      unit: formData.unit.trim(),
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      comment: formData.comment.trim() || undefined,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-3">Новая позиция</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="col-span-2">
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
            Наименование
          </label>
          <input
            type="text"
            id="itemName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Например: Демонтаж стен"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="itemUnit" className="block text-sm font-medium text-gray-700 mb-1">
            Единица измерения
          </label>
          <input
            type="text"
            id="itemUnit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Например: м², шт, м"
            required
          />
        </div>
        <div>
          <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-700 mb-1">
            Количество
          </label>
          <input
            type="number"
            id="itemQuantity"
            step="0.001"
            min="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="itemUnitPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Цена за единицу (₽)
          </label>
          <input
            type="number"
            id="itemUnitPrice"
            step="0.01"
            min="0"
            value={formData.unitPrice}
            onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Сумма (₽)
          </label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
            {(parseFloat(formData.quantity || '0') * parseFloat(formData.unitPrice || '0')).toFixed(2)}
          </div>
        </div>
        <div className="col-span-2">
          <label htmlFor="itemComment" className="block text-sm font-medium text-gray-700 mb-1">
            Комментарий (необязательно)
          </label>
          <input
            type="text"
            id="itemComment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Дополнительная информация"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : 'Добавить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};
