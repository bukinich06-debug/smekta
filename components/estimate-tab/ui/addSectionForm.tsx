'use client';

import { useState } from 'react';

interface IAddSectionFormProps {
  onAdd: (name: string) => Promise<void>;
  onCancel: () => void;
}

export const AddSectionForm = ({ onAdd, onCancel }: IAddSectionFormProps) => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setSaving(true);
    await onAdd(name.trim());
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Новый раздел</h3>
      <div className="mb-4">
        <label htmlFor="sectionName" className="block text-sm font-medium text-gray-700 mb-1">
          Название раздела
        </label>
        <input
          type="text"
          id="sectionName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Например: Демонтаж, Черновые работы"
          autoFocus
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
