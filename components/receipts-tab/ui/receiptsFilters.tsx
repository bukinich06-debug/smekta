import type { ReceiptStatusFilter } from '@/domain/receipts';

interface IReceiptsFiltersProps {
  statusFilter: ReceiptStatusFilter;
  onStatusFilterChange: (value: ReceiptStatusFilter) => void;
  dateOrder: 'asc' | 'desc';
  onDateOrderChange: (value: 'asc' | 'desc') => void;
}

const statusOptions: { value: ReceiptStatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'paid', label: 'Оплачено' },
  { value: 'underpaid', label: 'Недоплачено' },
  { value: 'pending', label: 'Ожидает оплаты' },
];

export const ReceiptsFilters = ({
  statusFilter,
  onStatusFilterChange,
  dateOrder,
  onDateOrderChange,
}: IReceiptsFiltersProps) => (
  <div className="flex flex-wrap gap-4 items-end mb-6">
    <div>
      <label className="block text-sm text-gray-500 mb-1">Статус</label>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as ReceiptStatusFilter)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm text-gray-500 mb-1">Сортировка по дате</label>
      <button
        type="button"
        onClick={() => onDateOrderChange(dateOrder === 'desc' ? 'asc' : 'desc')}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50"
      >
        {dateOrder === 'desc' ? 'Сначала новые' : 'Сначала старые'}
      </button>
    </div>
  </div>
);
