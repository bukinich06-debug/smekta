'use client';

import type { IFile } from '@/domain/files';
import { formatFileSize } from '../helpers/formatFileSize';
import { formatUploadedAt } from '../helpers/formatUploadedAt';

interface ITzAttachmentItemProps {
  file: IFile;
  readOnly: boolean;
  onDelete: (fileId: number) => void;
  deleting?: boolean;
}

const isImageMime = (mimeType: string) => mimeType === 'image/jpeg' || mimeType === 'image/png';

export const TzAttachmentItem = ({ file, readOnly, onDelete, deleting }: ITzAttachmentItemProps) => {
  const previewUrl = `/api/files/${file.id}`;
  const downloadUrl = `/api/files/${file.id}?download=1`;

  return (
    <li className="border border-gray-100 rounded-md bg-gray-50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate" title={file.originalName}>
            {file.originalName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatUploadedAt(file.uploadedAt)} · {file.uploadedByName} · {formatFileSize(file.size)}
          </p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <a href={downloadUrl} className="text-blue-600 hover:text-blue-800">
              Скачать
            </a>
            {!readOnly && (
              <button
                type="button"
                disabled={deleting}
                onClick={() => {
                  if (window.confirm('Удалить вложение?')) onDelete(file.id);
                }}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Удалить
              </button>
            )}
          </div>
        </div>
      </div>
      {isImageMime(file.mimeType) && (
        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="block mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- защищённый URL API, не статический asset */}
          <img
            src={previewUrl}
            alt={file.originalName}
            className="max-h-48 rounded border border-gray-200 bg-white object-contain"
          />
        </a>
      )}
    </li>
  );
};
