import type { IFile, IPhotoAlbumOption } from '@/domain/files';

export const groupPhotosByAlbum = (albums: IPhotoAlbumOption[], photos: IFile[]) => {
  const map = new Map<string, IFile[]>();

  for (const album of albums) map.set(album.id, []);

  for (const photo of photos) {
    const key = photo.album && map.has(photo.album) ? photo.album : albums[0]?.id;
    if (!key) continue;

    map.get(key)?.push(photo);
  }

  return albums.map((album) => ({
    album,
    photos: map.get(album.id) ?? [],
  }));
};
