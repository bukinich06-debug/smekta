'use client';

import { useState } from 'react';
import type { IEstimateItem } from '@/domain/estimates';
import { formatMoney } from '../helpers/formatMoney';
import { getStatusLabel } from '../helpers/getStatusLabel';

interface IEstimateItemProps {
  item: IEstimateItem;
  index: number;
  onEdit: (id: number, itemData: {
    name?: string;
    unit?: string;
    quantity?: string;
    unitPrice?: string;
    comment?: string;
    status?: 'DRAFT' | 'AGREED';
    isVisibleToClient?: boolean;
  }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const EstimateItem = ({ item, index, onEdit, onDelete }: IEstimateItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: item.name,
    unit: item.unit,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    comment: item.comment || '',
  });

  const total = parseFloat(item.quantity) * parseFloat(item.unitPrice);

  const handleSave = async () => {
    await onEdit(item.id, {
      name: formData.name,
      unit: formData.unit,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      comment: formData.comment || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      comment: item.comment || '',
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(`Удалить позицию "${item.name}"?`)) {
      await onDelete(item.id);
    }
  };

  if (isEditing) {
    return (
      <tr className="border-b border-gray-200 bg-blue-50">
        <td className="px-3 py-2 text-gray-700">{index}</td>
        <td className="px-3 py-2">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            step="0.001"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
          />
        </td>
        <td className="px-3 py-2">
          <input
            type="number"
            step="0.01"
            value={formData.unitPrice}
            onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
          />
        </td>
        <td className="px-3 py-2 text-right text-gray-700">
          {formatMoney(parseFloat(formData.quantity || '0') * parseFloat(formData.unitPrice || '0'))}
        </td>
        <td className="px-3 py-2">
          <input
            type="text"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </td>
        <td className="px-3 py-2 text-gray-700">{getStatusLabel(item.status)}</td>
        <td className="px-3 py-2 text-center text-gray-700">
          {item.isVisibleToClient ? 'Да' : 'Нет'}
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
            >
              ✕
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-3 py-2 text-gray-700">{index}</td>
      <td className="px-3 py-2 text-gray-900">{item.name}</td>
      <td className="px-3 py-2 text-gray-700">{item.unit}</td>
      <td className="px-3 py-2 text-right text-gray-700">{item.quantity}</td>
      <td className="px-3 py-2 text-right text-gray-700">{formatMoney(parseFloat(item.unitPrice))}</td>
      <td className="px-3 py-2 text-right font-medium text-gray-900">{formatMoney(total)}</td>
      <td className="px-3 py-2 text-gray-600 text-xs">{item.comment || '—'}</td>
      <td className="px-3 py-2 text-gray-700">
        <span className={`inline-block px-2 py-1 rounded text-xs ${
          item.status === 'AGREED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {getStatusLabel(item.status)}
        </span>
      </td>
      <td className="px-3 py-2 text-center text-gray-700">
        {item.isVisibleToClient ? 'Да' : 'Нет'}
      </td>
      <td className="px-3 py-2">
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
};
