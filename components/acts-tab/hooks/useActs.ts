'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { ActStatus } from '@prisma/client';
import type { IProjectActs, IAct } from '@/domain/acts';
import { getProjectActs } from '@/services/acts/getProjectActs';
import { createAct } from '@/services/acts/createAct';
import { updateAct } from '@/services/acts/updateAct';
import { deleteAct } from '@/services/acts/deleteAct';
import { updateActStatus } from '@/services/acts/updateActStatus';
import { parseInputDate } from '../helpers/formatDate';
import type { IActFormValues } from '../ui/actForm';

export const useActs = (projectId: number) => {
  const router = useRouter();
  const [data, setData] = useState<IProjectActs | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAct, setEditingAct] = useState<IAct | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const acts = await getProjectActs(projectId);
      setData(acts);
    } catch (err) {
      console.error('Ошибка при загрузке актов:', err);
      setError('Не удалось загрузить акты');
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
        const acts = await getProjectActs(projectId);
        if (!cancelled) setData(acts);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка при загрузке актов:', err);
          setError('Не удалось загрузить акты');
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

  const runAction = async (fn: () => Promise<{ ok: boolean; error?: string }>, successMsg: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    const result = await fn();
    setActionLoading(false);

    if (!result.ok) {
      setError(result.error || 'Ошибка операции');
      return;
    }

    setSuccess(successMsg);
    await load();
    router.refresh();
  };

  const formToInput = (values: IActFormValues) => {
    const date = parseInputDate(values.date);
    if (!date) return null;

    return {
      number: values.number,
      date,
      stage: values.stage || undefined,
      comment: values.comment || undefined,
      estimateItemIds: values.estimateItemIds,
    };
  };

  const submitCreate = async (values: IActFormValues) => {
    const parsed = formToInput(values);
    if (!parsed) {
      setError('Укажите корректную дату');
      return;
    }

    await runAction(() => createAct({ projectId, ...parsed }), 'Акт создан');
    setShowCreateForm(false);
  };

  const submitUpdate = async (values: IActFormValues) => {
    if (!editingAct) return;

    const parsed = formToInput(values);
    if (!parsed) {
      setError('Укажите корректную дату');
      return;
    }

    await runAction(() => updateAct(editingAct.id, parsed), 'Акт обновлён');
    setEditingAct(null);
  };

  const removeAct = async (id: number) => {
    await runAction(() => deleteAct(id), 'Акт удалён');
  };

  const changeStatus = async (id: number, status: ActStatus) => {
    await runAction(() => updateActStatus(id, status), 'Статус акта изменён');
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
    editingAct,
    setEditingAct,
    submitCreate,
    submitUpdate,
    removeAct,
    changeStatus,
    clearMessages,
  };
};
