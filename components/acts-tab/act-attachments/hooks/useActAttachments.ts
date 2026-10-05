'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFile } from '@/domain/files';
import { deleteActFile } from '@/services/files/deleteActFile';
import { listActFiles } from '@/services/files/listActFiles';
import { uploadActFile } from '@/services/files/uploadActFile';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface IUseActAttachmentsParams {
  actId: number;
  readOnly?: boolean;
}

export const useActAttachments = ({ actId, readOnly }: IUseActAttachmentsParams) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listActFiles(actId);
      setFiles(list);
    } catch (err) {
      console.error('Ошибка загрузки вложений акта:', err);
      setError('Не удалось загрузить вложения');
    } finally {
      setLoading(false);
    }
  }, [actId]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await listActFiles(actId);
        if (!cancelled) setFiles(list);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка загрузки вложений акта:', err);
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
  }, [actId]);

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
    formData.set('actId', String(actId));
    formData.set('file', file);

    const result = await uploadActFile(formData);
    setUploading(false);

    if (!result.ok) {
      setError(result.error || 'Не удалось загрузить файл');
      return;
    }

    await load();
  };

  const remove = async (fileId: number) => {
    setError(null);
    const result = await deleteActFile(fileId);
    if (!result.ok) {
      setError(result.error || 'Не удалось удалить файл');
      return;
    }

    await load();
  };

  return {
    files,
    loading,
    uploading,
    error,
    upload,
    remove,
    readOnly: Boolean(readOnly),
  };
};
