'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFile, PhotoAlbum } from '@/domain/files';
import { MAX_PHOTO_FILE_SIZE_BYTES } from '@/domain/files';
import { apiFetch } from '@/components/shared/api';

interface IUseProjectPhotosParams {
  projectId: number;
  readOnly?: boolean;
}

export const useProjectPhotos = ({ projectId, readOnly }: IUseProjectPhotosParams) => {
  const [photos, setPhotos] = useState<IFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await apiFetch<IFile[]>(`/api/projects/${projectId}/files/photos`);
      setPhotos(list);
    } catch (err) {
      console.error('Ошибка загрузки фото:', err);
      setError('Не удалось загрузить фото');
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
        const list = await apiFetch<IFile[]>(`/api/projects/${projectId}/files/photos`);
        if (!cancelled) setPhotos(list);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка загрузки фото:', err);
          setError('Не удалось загрузить фото');
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

  const upload = async (album: PhotoAlbum, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setError(null);

    for (const file of Array.from(fileList)) {
      if (file.size > MAX_PHOTO_FILE_SIZE_BYTES) {
        setError('Файл слишком большой (максимум 10 МБ)');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.set('projectId', String(projectId));
      formData.set('album', album);
      formData.set('file', file);

      await fetch(`/api/projects/${projectId}/files/photos`, {
        method: 'POST',
        body: formData,
      }).then((res) => { if (!res.ok) throw new Error('Upload failed'); });
    } catch (err) {
      setUploading(false);
      setError('Не удалось загрузить фото');
      return;
    }

    setUploading(false);
    await load();
  };

  const remove = async (fileId: number) => {
    setError(null);
    try {
      await apiFetch(`/api/projects/${projectId}/files/photos/${fileId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      setError('Не удалось удалить фото');
      return;
    }

    await load();
  };

  const saveMeta = async (fileId: number, caption: string | null, album: PhotoAlbum) => {
    setSavingId(fileId);
    setError(null);

    try {
      await apiFetch(`/api/projects/${projectId}/files/photos/${fileId}`, {
        method: 'PATCH',
        body: JSON.stringify({ caption, album }),
      });
    } catch (err) {
      setSavingId(null);
      setError('Не удалось сохранить изменения');
      return;
    }
    setSavingId(null);

    await load();
  };

  return {
    photos,
    loading,
    uploading,
    savingId,
    error,
    upload,
    remove,
    saveMeta,
    readOnly: Boolean(readOnly),
  };
};
