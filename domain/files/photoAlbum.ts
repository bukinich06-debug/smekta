export type PhotoAlbum = 'BEFORE' | 'PROCESS' | 'AFTER' | 'HIDDEN';

export interface IPhotoAlbumOption {
  id: PhotoAlbum;
  label: string;
  clientVisible: boolean;
}

export const PHOTO_ALBUMS: IPhotoAlbumOption[] = [
  { id: 'BEFORE', label: 'До начала работ', clientVisible: true },
  { id: 'PROCESS', label: 'Процесс', clientVisible: true },
  { id: 'AFTER', label: 'Завершение', clientVisible: true },
  { id: 'HIDDEN', label: 'Скрытые фото', clientVisible: false },
];
