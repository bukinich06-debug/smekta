'use client';

import { useAdminTzTab } from '../hooks/useAdminTzTab';
import { formatDateTime } from '../helpers/formatDateTime';
import { TzTextDisplay } from './tzTextDisplay';
import { TzFilesBlock } from './tzFilesBlock';
import { TzHistoryList } from './tzHistoryList';

interface IAdminTzTabProps {
  projectId: number;
}

export const AdminTzTab = ({ projectId }: IAdminTzTabProps) => {
  const {
    tz,
    history,
    loading,
    isEditing,
    draft,
    setDraft,
    saving,
    error,
    startEdit,
    cancelEdit,
    save,
  } = useAdminTzTab(projectId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!tz) {
    return <p className="text-gray-500">Проект не найден.</p>;
  }

  const updatedLine =
    tz.updatedAt && tz.updatedByName
      ? `Обновлено: ${formatDateTime(tz.updatedAt)}, ${tz.updatedByName}`
      : null;

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      <div className="flex justify-between items-start gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Техническое задание</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={startEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
          >
            Редактировать
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={14}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Сохранение…' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div>
          <TzTextDisplay text={tz.text} />
          {updatedLine && <p className="text-sm text-gray-500 mt-4">{updatedLine}</p>}
        </div>
      )}

      <TzFilesBlock />

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">История изменений</h3>
        <TzHistoryList items={history} />
      </div>
    </div>
  );
};
