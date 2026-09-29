'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getProjectEstimate } from '@/services/estimates/getProjectEstimate';
import { createSection } from '@/services/estimates/createSection';
import { updateSection } from '@/services/estimates/updateSection';
import { deleteSection } from '@/services/estimates/deleteSection';
import { createItem } from '@/services/estimates/createItem';
import { updateItem } from '@/services/estimates/updateItem';
import { deleteItem } from '@/services/estimates/deleteItem';
import type { IProjectEstimate } from '@/domain/estimates';

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
      const estimate = await getProjectEstimate(projectId);
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
        const estimate = await getProjectEstimate(projectId);
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

  const addSection = async (name: string) => {
    setError(null);
    setSuccess(null);
    const result = await createSection({ projectId, name });
    if (result.ok) {
      setSuccess('Раздел добавлен');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при создании раздела');
    }
  };

  const editSection = async (id: number, name: string) => {
    setError(null);
    setSuccess(null);
    const result = await updateSection(id, { name });
    if (result.ok) {
      setSuccess('Раздел обновлён');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при обновлении раздела');
    }
  };

  const removeSection = async (id: number) => {
    setError(null);
    setSuccess(null);
    const result = await deleteSection(id);
    if (result.ok) {
      setSuccess('Раздел удалён');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при удалении раздела');
    }
  };

  const addItem = async (sectionId: number, itemData: {
    name: string;
    unit: string;
    quantity: string;
    unitPrice: string;
    comment?: string;
  }) => {
    setError(null);
    setSuccess(null);
    const result = await createItem({ sectionId, ...itemData });
    if (result.ok) {
      setSuccess('Позиция добавлена');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при создании позиции');
    }
  };

  const editItem = async (id: number, itemData: {
    name?: string;
    unit?: string;
    quantity?: string;
    unitPrice?: string;
    comment?: string;
    status?: 'DRAFT' | 'AGREED';
    isVisibleToClient?: boolean;
  }) => {
    setError(null);
    setSuccess(null);
    const result = await updateItem(id, itemData);
    if (result.ok) {
      setSuccess('Позиция обновлена');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при обновлении позиции');
    }
  };

  const removeItem = async (id: number) => {
    setError(null);
    setSuccess(null);
    const result = await deleteItem(id);
    if (result.ok) {
      setSuccess('Позиция удалена');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при удалении позиции');
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
    clearMessages,
  };
};
