'use client';

import { useMemo, useState } from 'react';
import type { IFile } from '@/domain/files';
import { apiFetch } from '@/components/shared/api';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface IUseReceiptAttachmentsParams {
  projectId: number;
  receiptId: number;
  readOnly?: boolean;
  paymentId?: number | null;
  allFiles: IFile[];
  onReload: () => Promise<void>;
}

export const useReceiptAttachments = ({
  projectId,
  receiptId,
  readOnly,
  paymentId = null,
  allFiles,
  onReload,
}: IUseReceiptAttachmentsParams) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = useMemo(
    () => allFiles.filter((file) => file.receiptId === receiptId),
    [allFiles, receiptId]
  );

  const scopedFiles = useMemo(
    () => files.filter((file) => (paymentId === null ? file.paymentId === null : file.paymentId === paymentId)),
    [files, paymentId]
  );

  const upload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Файл слишком большой (максимум 10 МБ)');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.set('receiptId', String(receiptId));
    formData.set('file', file);
    if (paymentId !== null) formData.set('paymentId', String(paymentId));

    try {
      const res = await fetch(`/api/projects/${projectId}/receipts/${receiptId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Не удалось загрузить файл';
        try {
          const errorData = await res.json();
          if (errorData.error) errorMessage = errorData.error;
        } catch {
          // empty
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить файл');
      return;
    }
    
    setUploading(false);

    await onReload();
  };

  const remove = async (fileId: number) => {
    setError(null);
    try {
      await apiFetch(`/api/projects/${projectId}/receipts/${receiptId}/files/${fileId}`, {
        method: 'DELETE',
      });
      await onReload();
    } catch (err) {
      setError('Не удалось удалить файл');
    }
  };

  return {
    files: scopedFiles,
    uploading,
    error,
    upload,
    remove,
    readOnly: Boolean(readOnly),
  };
};
