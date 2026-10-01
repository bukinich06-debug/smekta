'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { IProjectExtraWorks, IExtraWork } from '@/domain/extra-works';
import { getProjectExtraWorks } from '@/services/extra-works/getProjectExtraWorks';
import { createExtraWork } from '@/services/extra-works/createExtraWork';
import { updateExtraWork } from '@/services/extra-works/updateExtraWork';
import { deleteExtraWork } from '@/services/extra-works/deleteExtraWork';
import { toggleExtraWorkStatus } from '@/services/extra-works/toggleExtraWorkStatus';
import { toggleExtraWorkVisibility } from '@/services/extra-works/toggleExtraWorkVisibility';
import { toggleExtraWorkBudget } from '@/services/extra-works/toggleExtraWorkBudget';
import { parseInputDate } from '../helpers/formatDate';
import type { IExtraWorkFormValues } from '../ui/extraWorkForm';

export const useExtraWorks = (projectId: number) => {
  const router = useRouter();
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
      const works = await getProjectExtraWorks(projectId);
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
        const works = await getProjectExtraWorks(projectId);
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

  const submitCreate = async (values: IExtraWorkFormValues) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await createExtraWork(toCreateInput(values));
      if (result.ok) {
        setSuccess('Допработа добавлена');
        setShowCreateForm(false);
        await load();
        router.refresh();
      } else {
        setError(result.error || 'Не удалось создать допработу');
      }
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
      const result = await updateExtraWork(id, toUpdateInput(values));
      if (result.ok) {
        setSuccess('Изменения сохранены');
        setEditingWork(null);
        await load();
        router.refresh();
      } else {
        setError(result.error || 'Не удалось обновить допработу');
      }
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
    const result = await deleteExtraWork(id);
    if (result.ok) {
      setSuccess('Допработа удалена');
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Не удалось удалить допработу');
    }
    setActionLoading(false);
  };

  const handleToggleStatus = async (id: number) => {
    setActionLoading(true);
    setError(null);
    const result = await toggleExtraWorkStatus(id);
    if (result.ok) {
      await load();
      router.refresh();
    } else setError(result.error || 'Не удалось переключить статус');
    setActionLoading(false);
  };

  const handleToggleVisibility = async (id: number) => {
    setActionLoading(true);
    setError(null);
    const result = await toggleExtraWorkVisibility(id);
    if (result.ok) {
      await load();
      router.refresh();
    } else setError(result.error || 'Не удалось переключить видимость');
    setActionLoading(false);
  };

  const handleToggleBudget = async (id: number) => {
    setActionLoading(true);
    setError(null);
    const result = await toggleExtraWorkBudget(id);
    if (result.ok) {
      await load();
      router.refresh();
    } else setError(result.error || 'Не удалось изменить учёт в бюджете');
    setActionLoading(false);
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
    handleToggleVisibility,
    handleToggleBudget,
    clearMessages,
  };
};
