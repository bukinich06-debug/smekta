'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFile } from '@/domain/files';
import { apiFetch } from '@/components/shared/api';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface IUseActAttachmentsParams {
  projectId: number;
  actId: number;
  readOnly?: boolean;
}

export const useActAttachments = ({ projectId, actId, readOnly }: IUseActAttachmentsParams) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await apiFetch<IFile[]>(`/api/projects/0/acts/${actId}/files`);
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
        const list = await apiFetch<IFile[]>(`/api/projects/${projectId}/acts/${actId}/files`);
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
    formData.set('file', file);

    try {
      await fetch(`/api/projects/${projectId}/acts/${actId}/files`, {
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
      await apiFetch(`/api/projects/${projectId}/acts/${actId}/files/${fileId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError('Не удалось удалить файл');
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
