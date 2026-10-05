'use client';

import { useRef } from 'react';
import { useTzAttachments } from '../hooks/useTzAttachments';
import { TzAttachmentItem } from './tzAttachmentItem';

interface ITzAttachmentsProps {
  projectId: number;
  readOnly?: boolean;
}

export const TzAttachments = ({ projectId, readOnly }: ITzAttachmentsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, loading, uploading, error, upload, remove, readOnly: isReadOnly } = useTzAttachments({
    projectId,
    readOnly,
  });

  if (loading) {
    return (
      <div className="mt-8 border-t border-gray-200 pt-6">
        <p className="text-xs text-gray-500">Загрузка вложений…</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Файлы</h3>
        {!isReadOnly && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(e) => {
                upload(e.target.files);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {uploading ? 'Загрузка…' : 'Загрузить файл'}
            </button>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

      {files.length === 0 && <p className="text-sm text-gray-500">Вложений пока нет</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <TzAttachmentItem
              key={file.id}
              file={file}
              readOnly={isReadOnly}
              deleting={uploading}
              onDelete={remove}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
