'use client';

import { useEffect, useState } from 'react';
import type { IFile, PhotoAlbum } from '@/domain/files';
import { PHOTO_ALBUMS } from '@/domain/files';
import { formatUploadedAt } from '@/components/tz-tab/tz-attachments/helpers/formatUploadedAt';

interface IPhotoCardProps {
  photo: IFile;
  readOnly: boolean;
  saving?: boolean;
  onOpen: (photo: IFile) => void;
  onDelete: (fileId: number) => void;
  onSave: (fileId: number, caption: string | null, album: PhotoAlbum) => void;
}

export const PhotoCard = ({ photo, readOnly, saving, onOpen, onDelete, onSave }: IPhotoCardProps) => {
  const previewUrl = `/api/files/${photo.id}`;
  const [caption, setCaption] = useState(photo.caption ?? '');
  const [album, setAlbum] = useState<PhotoAlbum>(photo.album ?? 'PROCESS');

  const dirty = caption !== (photo.caption ?? '') || album !== (photo.album ?? 'PROCESS');

  return (
    <li className="border border-gray-100 rounded-md bg-gray-50 overflow-hidden flex flex-col">
      <button type="button" className="block w-full text-left" onClick={() => onOpen(photo)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- защищённый URL API */}
        <img
          src={previewUrl}
          alt={photo.caption || photo.originalName}
          className="w-full h-40 object-cover bg-white"
        />
      </button>
      <div className="p-3 flex-1 flex flex-col gap-2">
        <p className="text-xs text-gray-500">
          {formatUploadedAt(photo.uploadedAt)} · {photo.uploadedByName}
        </p>
        {readOnly ? (
          photo.caption && <p className="text-sm text-gray-800">{photo.caption}</p>
        ) : (
          <>
            <label className="block text-xs text-gray-600">
              Подпись
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                placeholder="Подпись к фото"
              />
            </label>
            <label className="block text-xs text-gray-600">
              Альбом
              <select
                value={album}
                onChange={(e) => setAlbum(e.target.value as PhotoAlbum)}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm bg-white"
              >
                {PHOTO_ALBUMS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              <button
                type="button"
                disabled={!dirty || saving}
                onClick={() => onSave(photo.id, caption.trim() || null, album)}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {saving ? 'Сохранение…' : 'Сохранить'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  if (window.confirm('Удалить фото?')) onDelete(photo.id);
                }}
                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Удалить
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
};
