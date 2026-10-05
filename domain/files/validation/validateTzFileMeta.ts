import { ALLOWED_RECEIPT_MIME_TYPES, MAX_RECEIPT_FILE_SIZE_BYTES } from '../constants';

interface IValidateTzFileMetaParams {
  mimeType: string;
  size: number;
}

export const validateTzFileMeta = ({ mimeType, size }: IValidateTzFileMetaParams): string | null => {
  if (!ALLOWED_RECEIPT_MIME_TYPES.includes(mimeType as (typeof ALLOWED_RECEIPT_MIME_TYPES)[number]))
    return 'Допустимы только файлы JPG, PNG и PDF';

  if (size <= 0) return 'Файл пустой';

  if (size > MAX_RECEIPT_FILE_SIZE_BYTES)
    return `Размер файла не должен превышать ${Math.round(MAX_RECEIPT_FILE_SIZE_BYTES / (1024 * 1024))} МБ`;

  return null;
};
