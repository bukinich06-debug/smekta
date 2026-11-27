'use client';

import { useMemo, useState } from 'react';
import type { IFile } from '@/domain/files';
import { apiFetch } from '@/components/shared/api';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface IUseActAttachmentsParams {
  projectId: number;
  actId: number;
  readOnly?: boolean;
  allFiles: IFile[];
  onReload: () => Promise<void>;
}

export const useActAttachments = ({ projectId, actId, readOnly, allFiles, onReload }: IUseActAttachmentsParams) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = useMemo(
    () => allFiles.filter((file) => file.actId === actId),
    [allFiles, actId]
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
    formData.set('file', file);

    try {
      const res = await fetch(`/api/projects/${projectId}/acts/${actId}/files`, {
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
      await apiFetch(`/api/projects/${projectId}/acts/${actId}/files/${fileId}`, {
        method: 'DELETE',
      });
      await onReload();
    } catch (err) {
      setError('Не удалось удалить файл');
    }
  };

  return {
    files,
    uploading,
    error,
    upload,
    remove,
    readOnly: Boolean(readOnly),
  };
};
