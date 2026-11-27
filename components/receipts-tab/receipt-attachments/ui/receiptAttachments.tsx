'use client';

import { useRef } from 'react';
import type { IFile } from '@/domain/files';
import { useReceiptAttachments } from '../hooks/useReceiptAttachments';
import { ReceiptAttachmentItem } from './receiptAttachmentItem';

interface IReceiptAttachmentsProps {
  projectId: number;
  receiptId: number;
  readOnly?: boolean;
  paymentId?: number | null;
  title?: string;
  compact?: boolean;
  allFiles: IFile[];
  onReload: () => Promise<void>;
  filesLoading?: boolean;
}

export const ReceiptAttachments = ({
  projectId,
  receiptId,
  readOnly,
  paymentId = null,
  title,
  compact,
  allFiles,
  onReload,
  filesLoading = false,
}: IReceiptAttachmentsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, uploading, error, upload, remove, readOnly: isReadOnly } = useReceiptAttachments({
    projectId,
    receiptId,
    readOnly,
    paymentId,
    allFiles,
    onReload,
  });

  const heading = title ?? (paymentId === null ? 'Вложения' : 'Документы по оплате');

  return (
    <div className={compact ? 'mt-2' : 'mt-4 border-t border-gray-100 pt-4'}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-gray-700">{heading}</h4>
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

      {filesLoading && <p className="text-sm text-gray-500">Загрузка вложений…</p>}

      {!filesLoading && files.length === 0 && <p className="text-sm text-gray-500">Вложений пока нет</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <ReceiptAttachmentItem
              key={file.id}
              file={file}
              readOnly={isReadOnly}
              compact={compact}
              deleting={uploading}
              onDelete={remove}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
