'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFile } from '@/domain/files';
import { deleteTzFile } from '@/services/files/deleteTzFile';
import { listTzFiles } from '@/services/files/listTzFiles';
import { uploadTzFile } from '@/services/files/uploadTzFile';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface IUseTzAttachmentsParams {
  projectId: number;
  readOnly?: boolean;
}

export const useTzAttachments = ({ projectId, readOnly }: IUseTzAttachmentsParams) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listTzFiles(projectId);
      setFiles(list);
    } catch (err) {
      console.error('Ошибка загрузки вложений ТЗ:', err);
      setError('Не удалось загрузить вложения');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await listTzFiles(projectId);
        if (!cancelled) setFiles(list);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка загрузки вложений ТЗ:', err);
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
  }, [projectId]);

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
    formData.set('projectId', String(projectId));
    formData.set('file', file);

    const result = await uploadTzFile(formData);
    setUploading(false);

    if (!result.ok) {
      setError(result.error || 'Не удалось загрузить файл');
      return;
    }

    await load();
  };

  const remove = async (fileId: number) => {
    setError(null);
    const result = await deleteTzFile(fileId);
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
