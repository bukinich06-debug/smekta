'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { IProjectReceipts, IReceipt, ReceiptStatusFilter } from '@/domain/receipts';
import { getProjectReceipts } from '@/services/receipts/getProjectReceipts';
import { createReceipt } from '@/services/receipts/createReceipt';
import { updateReceipt } from '@/services/receipts/updateReceipt';
import { deleteReceipt } from '@/services/receipts/deleteReceipt';
import { addPayment } from '@/services/receipts/addPayment';
import { payReceiptFull } from '@/services/receipts/payReceiptFull';
import { deletePayment } from '@/services/receipts/deletePayment';
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
      const receipts = await getProjectReceipts(projectId);
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
        const receipts = await getProjectReceipts(projectId);
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

  const runAction = async (fn: () => Promise<{ ok: boolean; error?: string }>, successMsg: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    const result = await fn();
    setActionLoading(false);
    if (result.ok) {
      setSuccess(successMsg);
      await load();
      router.refresh();
    } else {
      setError(result.error || 'Ошибка операции');
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

    await runAction(
      () => createReceipt({ projectId, ...parsed }),
      'Чек создан',
    );
    setShowCreateForm(false);
  };

  const submitUpdate = async (values: IReceiptFormValues) => {
    if (!editingReceipt) return;

    const parsed = formToInput(values);
    if (!parsed) {
      setError('Укажите корректную дату');
      return;
    }

    await runAction(
      () => updateReceipt(editingReceipt.id, parsed),
      'Чек обновлён',
    );
    setEditingReceipt(null);
  };

  const removeReceipt = async (id: number) => {
    await runAction(() => deleteReceipt(id), 'Чек удалён');
  };

  const handlePayFull = async (receiptId: number, date: Date) => {
    await runAction(() => payReceiptFull(receiptId, date), 'Оплата добавлена');
  };

  const handlePayPartial = async (receiptId: number, date: Date, amount: string) => {
    await runAction(
      () => addPayment({ receiptId, date, amount }),
      'Частичная оплата добавлена',
    );
  };

  const handleDeletePayment = async (paymentId: number) => {
    await runAction(() => deletePayment(paymentId), 'Оплата удалена');
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
