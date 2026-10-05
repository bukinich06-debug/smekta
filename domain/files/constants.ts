export const MAX_RECEIPT_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const MAX_PHOTO_FILE_SIZE_BYTES = MAX_RECEIPT_FILE_SIZE_BYTES;

export const ALLOWED_RECEIPT_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const;

export const ALLOWED_PHOTO_MIME_TYPES = ['image/jpeg', 'image/png'] as const;

export type ReceiptMimeType = (typeof ALLOWED_RECEIPT_MIME_TYPES)[number];

export type PhotoMimeType = (typeof ALLOWED_PHOTO_MIME_TYPES)[number];
