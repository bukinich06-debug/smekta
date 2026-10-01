'use client';

import type { IActPickerSection } from '@/domain/acts';
import { formatMoney } from '../helpers/formatMoney';

interface IActItemPickerProps {
  sections: IActPickerSection[];
  selectedIds: number[];
  editingActId?: number;
  onChange: (ids: number[]) => void;
}

export const ActItemPicker = ({
  sections,
  selectedIds,
  editingActId,
  onChange,
}: IActItemPickerProps) => {
  const toggle = (itemId: number, disabled: boolean) => {
    if (disabled) return;

    if (selectedIds.includes(itemId)) onChange(selectedIds.filter((id) => id !== itemId));
    else onChange([...selectedIds, itemId]);
  };

  if (sections.every((section) => section.items.length === 0)) {
    return <p className="text-sm text-gray-500">В смете пока нет позиций.</p>;
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
      {sections.map((section) => (
        <div key={section.id}>
          <p className="text-sm font-semibold text-gray-800 mb-2">{section.name}</p>
          <ul className="space-y-2">
            {section.items.map((item) => {
              const takenByOther =
                item.assignedActId !== null &&
                (editingActId === undefined || item.assignedActId !== editingActId);
              const checked = selectedIds.includes(item.id);

              return (
                <li key={item.id} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id={`act-item-${item.id}`}
                    checked={checked}
                    disabled={takenByOther}
                    onChange={() => toggle(item.id, takenByOther)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <label
                    htmlFor={`act-item-${item.id}`}
                    className={`text-sm flex-1 ${takenByOther ? 'text-gray-400' : 'text-gray-700'}`}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="block text-gray-500">
                      {item.quantity} {item.unit} × {formatMoney(parseFloat(item.unitPrice))} ={' '}
                      {formatMoney(item.amount)}
                    </span>
                    {takenByOther && item.assignedActNumber && (
                      <span className="block text-xs text-amber-700">
                        Уже в акте №{item.assignedActNumber}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
