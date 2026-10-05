'use client';

import type { IFile } from '@/domain/files';
import { formatUploadedAt } from '@/components/tz-tab/tz-attachments/helpers/formatUploadedAt';

interface ILightboxProps {
  photo: IFile;
  onClose: () => void;
}

export const Lightbox = ({ photo, onClose }: ILightboxProps) => {
  const previewUrl = `/api/files/${photo.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-4 right-4 text-white text-sm px-3 py-1 rounded bg-black/50 hover:bg-black/70"
        onClick={onClose}
      >
        Закрыть
      </button>
      <div
        className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- защищённый URL API */}
        <img
          src={previewUrl}
          alt={photo.caption || photo.originalName}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded bg-white"
        />
        <div className="mt-3 text-center text-white text-sm space-y-1">
          {photo.caption && <p className="font-medium">{photo.caption}</p>}
          <p className="text-white/80">
            {formatUploadedAt(photo.uploadedAt)} · {photo.uploadedByName}
          </p>
        </div>
      </div>
    </div>
  );
};
