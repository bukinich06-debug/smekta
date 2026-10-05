'use client';

import { useRef } from 'react';
import type { IFile, IPhotoAlbumOption, PhotoAlbum } from '@/domain/files';
import { PhotoCard } from './photoCard';

interface IPhotoAlbumSectionProps {
  album: IPhotoAlbumOption;
  photos: IFile[];
  readOnly: boolean;
  uploading: boolean;
  savingId: number | null;
  onUpload: (album: PhotoAlbum, files: FileList | null) => void;
  onOpen: (photo: IFile) => void;
  onDelete: (fileId: number) => void;
  onSave: (fileId: number, caption: string | null, album: PhotoAlbum) => void;
}

export const PhotoAlbumSection = ({
  album,
  photos,
  readOnly,
  uploading,
  savingId,
  onUpload,
  onOpen,
  onDelete,
  onSave,
}: IPhotoAlbumSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="mb-8 last:mb-0">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{album.label}</h3>
        {!readOnly && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => {
                onUpload(album.id, e.target.files);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {uploading ? 'Загрузка…' : 'Загрузить фото'}
            </button>
          </>
        )}
      </div>

      {photos.length === 0 && <p className="text-sm text-gray-500">В этом альбоме пока нет фото</p>}

      {photos.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              readOnly={readOnly}
              saving={savingId === photo.id}
              onOpen={onOpen}
              onDelete={onDelete}
              onSave={onSave}
            />
          ))}
        </ul>
      )}
    </section>
  );
};
