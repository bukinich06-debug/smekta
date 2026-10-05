'use client';

import { PHOTO_ALBUMS } from '@/domain/files';
import { groupPhotosByAlbum } from '../helpers/groupPhotosByAlbum';
import { useLightbox } from '../hooks/useLightbox';
import { useProjectPhotos } from '../hooks/useProjectPhotos';
import { Lightbox } from './lightbox';
import { PhotoAlbumSection } from './photoAlbumSection';

interface IProjectPhotoGalleryProps {
  projectId: number;
  readOnly?: boolean;
}

export const ProjectPhotoGallery = ({ projectId, readOnly }: IProjectPhotoGalleryProps) => {
  const {
    photos,
    loading,
    uploading,
    savingId,
    error,
    upload,
    remove,
    saveMeta,
    readOnly: isReadOnly,
  } = useProjectPhotos({ projectId, readOnly });

  const { photo: lightboxPhoto, open, close } = useLightbox();

  const visibleAlbums = isReadOnly
    ? PHOTO_ALBUMS.filter((album) => album.clientVisible)
    : PHOTO_ALBUMS;

  const sections = groupPhotosByAlbum(visibleAlbums, photos);

  if (loading) return <p className="text-sm text-gray-500">Загрузка фото…</p>;

  return (
    <div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {sections.map(({ album, photos: albumPhotos }) => (
        <PhotoAlbumSection
          key={album.id}
          album={album}
          photos={albumPhotos}
          readOnly={isReadOnly}
          uploading={uploading}
          savingId={savingId}
          onUpload={upload}
          onOpen={open}
          onDelete={remove}
          onSave={saveMeta}
        />
      ))}

      {lightboxPhoto && <Lightbox photo={lightboxPhoto} onClose={close} />}
    </div>
  );
};
