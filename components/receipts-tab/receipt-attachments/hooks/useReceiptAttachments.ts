'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFile } from '@/domain/files';

import { apiFetch } from '@/components/shared/api';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface IUseReceiptAttachmentsParams {
  projectId: number;
  receiptId: number;
  readOnly?: boolean;
  paymentId?: number | null;
}

export const useReceiptAttachments = ({
  projectId,
  receiptId,
  readOnly,
  paymentId = null,
}: IUseReceiptAttachmentsParams) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await apiFetch<IFile[]>(`/api/projects/${projectId}/receipts/${receiptId}/files`);
      setFiles(list);
    } catch (err) {
      console.error('Ошибка загрузки вложений чека:', err);
      setError('Не удалось загрузить вложения');
    } finally {
      setLoading(false);
    }
  }, [receiptId]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await apiFetch<IFile[]>(`/api/projects/${projectId}/receipts/${receiptId}/files`);
        if (!cancelled) setFiles(list);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка загрузки вложений чека:', err);
          setError('Не удалось загрузить вложения');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [receiptId]);

  const scopedFiles = files.filter((file) =>
    paymentId === null ? file.paymentId === null : file.paymentId === paymentId
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
      await fetch(`/api/projects/${projectId}/receipts/${receiptId}/files`, {
        method: 'POST',
        body: formData,
      }).then((res) => { if (!res.ok) throw new Error('Upload failed'); });
    } catch (err) {
      setUploading(false);
      setError('Не удалось загрузить файл');
      return;
    }
    
    setUploading(false);

    await load();
  };

  const remove = async (fileId: number) => {
    setError(null);
    try {
      await apiFetch(`/api/projects/${projectId}/receipts/${receiptId}/files/${fileId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError('Не удалось удалить файл');
      return;
    }

    await load();
  };

  return {
    files: scopedFiles,
    loading,
    uploading,
    error,
    upload,
    remove,
    readOnly: Boolean(readOnly),
  };
};
