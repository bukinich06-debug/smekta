import { ALLOWED_PHOTO_MIME_TYPES, MAX_PHOTO_FILE_SIZE_BYTES } from '../constants';

interface IValidatePhotoFileMetaParams {
  mimeType: string;
  size: number;
}

export const validatePhotoFileMeta = ({ mimeType, size }: IValidatePhotoFileMetaParams): string | null => {
  if (!ALLOWED_PHOTO_MIME_TYPES.includes(mimeType as (typeof ALLOWED_PHOTO_MIME_TYPES)[number]))
    return 'Допустимы только фотографии JPG и PNG';

  if (size <= 0) return 'Файл пустой';

  if (size > MAX_PHOTO_FILE_SIZE_BYTES)
    return `Размер файла не должен превышать ${Math.round(MAX_PHOTO_FILE_SIZE_BYTES / (1024 * 1024))} МБ`;

  return null;
};
