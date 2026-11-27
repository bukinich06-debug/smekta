'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { IProjectExtraWorks, IExtraWork } from '@/domain/extra-works';
import { apiFetch } from '@/components/shared/api';
import { parseInputDate } from '../helpers/formatDate';
import type { IExtraWorkFormValues } from '../ui/extraWorkForm';
import { useBudgetRefetch } from '@/components/client-card/context/budgetRefetchContext';

export const useExtraWorks = (projectId: number) => {
  const router = useRouter();
  const { refetch: refetchBudget } = useBudgetRefetch();
  const [data, setData] = useState<IProjectExtraWorks | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingWork, setEditingWork] = useState<IExtraWork | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const works = await apiFetch<IProjectExtraWorks>(`/api/projects/${projectId}/extra-works`);
      setData(works);
    } catch (err) {
      console.error('Ошибка при загрузке допработ:', err);
      setError('Не удалось загрузить дополнительные работы');
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
        const works = await apiFetch<IProjectExtraWorks>(`/api/projects/${projectId}/extra-works`);
        if (!cancelled) setData(works);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка при загрузке допработ:', err);
          setError('Не удалось загрузить дополнительные работы');
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

  const toCreateInput = (values: IExtraWorkFormValues) => {
    const date = parseInputDate(values.date);
    if (!date) throw new Error('Укажите корректную дату');

    return {
      projectId,
      date,
      description: values.description,
      unit: values.unit,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      isVisibleToClient: values.isVisibleToClient,
      includedInBudget: values.includedInBudget,
    };
  };

  const toUpdateInput = (values: IExtraWorkFormValues) => {
    const date = parseInputDate(values.date);
    if (!date) throw new Error('Укажите корректную дату');

    return {
      date,
      description: values.description,
      unit: values.unit,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      isVisibleToClient: values.isVisibleToClient,
      includedInBudget: values.includedInBudget,
    };
  };

  const reloadSilently = useCallback(async () => {
    try {
      const works = await apiFetch<IProjectExtraWorks>(`/api/projects/${projectId}/extra-works`);
      setData(works);
    } catch (err) {
      console.error('Ошибка при обновлении допработ:', err);
    }
  }, [projectId]);

  const submitCreate = async (values: IExtraWorkFormValues) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works`, {
        method: 'POST',
        body: JSON.stringify(toCreateInput(values)),
      });
      setSuccess('Допработа добавлена');
      setShowCreateForm(false);
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать допработу');
    } finally {
      setActionLoading(false);
    }
  };

  const submitUpdate = async (id: number, values: IExtraWorkFormValues) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(toUpdateInput(values)),
      });
      setSuccess('Изменения сохранены');
      setEditingWork(null);
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить допработу');
    } finally {
      setActionLoading(false);
    }
  };

  const removeWork = async (id: number) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiFetch(`/api/projects/${projectId}/extra-works/${id}`, { method: 'DELETE' });
      setSuccess('Допработа удалена');
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError('Не удалось удалить допработу');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works/${id}/status`, { method: 'PATCH' });
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError('Не удалось переключить статус');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVisibility = async (id: number) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works/${id}/visibility`, { method: 'PATCH' });
      await reloadSilently();
    } catch (err) {
      setError('Не удалось переключить видимость');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBudget = async (id: number) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works/${id}/budget`, { method: 'PATCH' });
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError('Не удалось изменить учёт в бюджете');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDone = async (id: number) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works/${id}/done`, { method: 'PATCH' });
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError('Не удалось отметить выполненной');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnmarkDone = async (id: number) => {
    setActionLoading(true);
    setError(null);
    try {
      await apiFetch<{ extraWork: IExtraWork }>(`/api/projects/${projectId}/extra-works/${id}/done`, { method: 'DELETE' });
      await reloadSilently();
      refetchBudget();
    } catch (err) {
      setError('Не удалось снять отметку выполнения');
    } finally {
      setActionLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    data,
    loading,
    actionLoading,
    error,
    success,
    showCreateForm,
    setShowCreateForm,
    editingWork,
    setEditingWork,
    submitCreate,
    submitUpdate,
    removeWork,
    handleToggleStatus,
    handleMarkDone,
    handleUnmarkDone,
    handleToggleVisibility,
    handleToggleBudget,
    clearMessages,
  };
};
