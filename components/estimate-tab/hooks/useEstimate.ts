'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/components/shared/api';
import type { IProjectEstimate, IEstimateSection, IEstimateItem } from '@/domain/estimates';

export const useEstimate = (projectId: number) => {
  const router = useRouter();
  const [data, setData] = useState<IProjectEstimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const estimate = await apiFetch<IProjectEstimate>(
        `/api/projects/${projectId}/estimate`
      );
      setData(estimate);
    } catch (err) {
      console.error('Ошибка при загрузке сметы:', err);
      setError('Не удалось загрузить смету');
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
        const estimate = await apiFetch<IProjectEstimate>(
          `/api/projects/${projectId}/estimate`
        );
        if (!cancelled) setData(estimate);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка при загрузке сметы:', err);
          setError('Не удалось загрузить смету');
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

  const reloadSilently = useCallback(async () => {
    try {
      const estimate = await apiFetch<IProjectEstimate>(
        `/api/projects/${projectId}/estimate`
      );
      setData(estimate);
    } catch (err) {
      console.error('Ошибка при обновлении сметы:', err);
    }
  }, [projectId]);

  const addSection = async (name: string) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ section: IEstimateSection }>(
        `/api/projects/${projectId}/estimate/sections`,
        {
          method: 'POST',
          body: JSON.stringify({ name }),
        }
      );
      setSuccess('Раздел добавлен');
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании раздела');
    }
  };

  const editSection = async (id: number, name: string) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ section: IEstimateSection }>(
        `/api/projects/${projectId}/estimate/sections/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ name }),
        }
      );
      setSuccess('Раздел обновлён');
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении раздела');
    }
  };

  const removeSection = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ ok: boolean }>(
        `/api/projects/${projectId}/estimate/sections/${id}`,
        {
          method: 'DELETE',
        }
      );
      setSuccess('Раздел удалён');
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении раздела');
    }
  };

  const addItem = async (
    sectionId: number,
    itemData: {
      name: string;
      unit: string;
      quantity: string;
      unitPrice: string;
      comment?: string;
    }
  ) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ item: IEstimateItem }>(
        `/api/projects/${projectId}/estimate/items`,
        {
          method: 'POST',
          body: JSON.stringify({ sectionId, ...itemData }),
        }
      );
      setSuccess('Позиция добавлена');
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании позиции');
    }
  };

  const editItem = async (
    id: number,
    itemData: {
      name?: string;
      unit?: string;
      quantity?: string;
      unitPrice?: string;
      comment?: string;
      status?: 'DRAFT' | 'AGREED';
      isVisibleToClient?: boolean;
    }
  ) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ item: IEstimateItem }>(
        `/api/projects/${projectId}/estimate/items/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(itemData),
        }
      );
      setSuccess('Позиция обновлена');
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении позиции');
    }
  };

  const removeItem = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ ok: boolean }>(
        `/api/projects/${projectId}/estimate/items/${id}`,
        {
          method: 'DELETE',
        }
      );
      setSuccess('Позиция удалена');
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении позиции');
    }
  };

  const toggleVisibility = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ item: IEstimateItem }>(
        `/api/projects/${projectId}/estimate/items/${id}/visibility`,
        {
          method: 'PATCH',
        }
      );
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении видимости');
    }
  };

  const toggleStatus = async (id: number) => {
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ item: IEstimateItem }>(
        `/api/projects/${projectId}/estimate/items/${id}/status`,
        {
          method: 'PATCH',
        }
      );
      await reloadSilently();
    } catch (err: any) {
      setError(err.message || 'Ошибка при изменении статуса');
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    data,
    loading,
    error,
    success,
    addSection,
    editSection,
    removeSection,
    addItem,
    editItem,
    removeItem,
    toggleVisibility,
    toggleStatus,
    clearMessages,
  };
};
