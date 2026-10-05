'use client';

import { useRef } from 'react';
import { useActAttachments } from '../hooks/useActAttachments';
import { ActAttachmentItem } from './actAttachmentItem';

interface IActAttachmentsProps {
  actId: number;
  readOnly?: boolean;
}

export const ActAttachments = ({ actId, readOnly }: IActAttachmentsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, loading, uploading, error, upload, remove, readOnly: isReadOnly } = useActAttachments({
    actId,
    readOnly,
  });

  if (loading) {
    return (
      <div>
        <p className="text-xs text-gray-500">Загрузка вложений…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-gray-700">Вложения</h4>
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
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
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
            <ActAttachmentItem
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
