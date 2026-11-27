'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/components/shared/api';
import type { IProjectReceipts, IReceipt, ReceiptStatusFilter } from '@/domain/receipts';
import { parseInputDate } from '../helpers/formatDate';
import type { IReceiptFormValues } from '../ui/receiptForm';
import { filterReceiptsByStatus, sortReceiptsByDate } from '../helpers/filterReceipts';

export const useReceipts = (projectId: number) => {
  const router = useRouter();
  const [data, setData] = useState<IProjectReceipts | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReceiptStatusFilter>('all');
  const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc');
  const [editingReceipt, setEditingReceipt] = useState<IReceipt | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const receipts = await apiFetch<IProjectReceipts>(`/api/projects/${projectId}/receipts`);
      setData(receipts);
    } catch (err) {
      console.error('Ошибка при загрузке чеков:', err);
      setError('Не удалось загрузить чеки');
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
        const receipts = await apiFetch<IProjectReceipts>(`/api/projects/${projectId}/receipts`);
        if (!cancelled) setData(receipts);
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка при загрузке чеков:', err);
          setError('Не удалось загрузить чеки');
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

  const runAction = async (fn: () => Promise<void>, successMsg: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await fn();
      setSuccess(successMsg);
      await load();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ошибка операции');
    } finally {
      setActionLoading(false);
    }
  };

  const formToInput = (values: IReceiptFormValues): {
    date: Date;
    title: string;
    amountDue: string;
    comment?: string;
    estimateSectionId: number | null;
  } | null => {
    const date = parseInputDate(values.date);
    if (!date) return null;

    const sectionId = values.estimateSectionId ? parseInt(values.estimateSectionId, 10) : null;

    return {
      date,
      title: values.title,
      amountDue: values.amountDue,
      comment: values.comment || undefined,
      estimateSectionId: sectionId && !isNaN(sectionId) ? sectionId : null,
    };
  };

  const submitCreate = async (values: IReceiptFormValues) => {
    const parsed = formToInput(values);
    if (!parsed) {
      setError('Укажите корректную дату');
      return;
    }

    await runAction(async () => {
      await apiFetch<{ receipt: IReceipt }>(`/api/projects/${projectId}/receipts`, {
        method: 'POST',
        body: JSON.stringify(parsed),
      });
    }, 'Чек создан');
    setShowCreateForm(false);
  };

  const submitUpdate = async (values: IReceiptFormValues) => {
    if (!editingReceipt) return;

    const parsed = formToInput(values);
    if (!parsed) {
      setError('Укажите корректную дату');
      return;
    }

    await runAction(async () => {
      await apiFetch<{ receipt: IReceipt }>(`/api/projects/${projectId}/receipts/${editingReceipt.id}`, {
        method: 'PATCH',
        body: JSON.stringify(parsed),
      });
    }, 'Чек обновлён');
    setEditingReceipt(null);
  };

  const removeReceipt = async (id: number) => {
    await runAction(async () => {
      await apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/receipts/${id}`, {
        method: 'DELETE',
      });
    }, 'Чек удалён');
  };

  const handlePayFull = async (receiptId: number, date: Date) => {
    await runAction(async () => {
      await apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/receipts/${receiptId}/pay-full`, {
        method: 'POST',
        body: JSON.stringify({ date: date.toISOString() }),
      });
    }, 'Оплата добавлена');
  };

  const handlePayPartial = async (receiptId: number, date: Date, amount: string) => {
    await runAction(async () => {
      await apiFetch(`/api/projects/${projectId}/receipts/${receiptId}/payments`, {
        method: 'POST',
        body: JSON.stringify({ date: date.toISOString(), amount }),
      });
    }, 'Частичная оплата добавлена');
  };

  const handleDeletePayment = async (receiptId: number, paymentId: number) => {
    await runAction(async () => {
      await apiFetch<{ ok: boolean }>(`/api/projects/${projectId}/receipts/${receiptId}/payments/${paymentId}`, {
        method: 'DELETE',
      });
    }, 'Оплата удалена');
  };

  const displayedReceipts = useMemo(() => {
    if (!data) return [];
    const filtered = filterReceiptsByStatus(data.receipts, statusFilter);
    return sortReceiptsByDate(filtered, dateOrder);
  }, [data, statusFilter, dateOrder]);

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
    statusFilter,
    setStatusFilter,
    dateOrder,
    setDateOrder,
    displayedReceipts,
    showCreateForm,
    setShowCreateForm,
    editingReceipt,
    setEditingReceipt,
    submitCreate,
    submitUpdate,
    removeReceipt,
    handlePayFull,
    handlePayPartial,
    handleDeletePayment,
    clearMessages,
  };
};
