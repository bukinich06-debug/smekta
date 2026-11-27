'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFinanceHistoryItem, IProjectFinance, IProjectInflow, IWalletTransfer } from '@/domain/finance';
import { apiFetch } from '@/components/shared/api';
import { useBudgetRefetch } from '@/components/client-card/context/budgetRefetchContext';

export const useFinanceTab = (projectId: number) => {
  const { refetch: refetchBudget } = useBudgetRefetch();
  const [data, setData] = useState<IProjectFinance | null>(null);
  const [history, setHistory] = useState<IFinanceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showInflowForm, setShowInflowForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [editingInflow, setEditingInflow] = useState<IProjectInflow | null>(null);
  const [editingTransfer, setEditingTransfer] = useState<IWalletTransfer | null>(null);

  const reload = useCallback(async () => {
    try {
      const [finance, historyRows] = await Promise.all([
        apiFetch<IProjectFinance>(`/api/projects/${projectId}/finance`),
        apiFetch<IFinanceHistoryItem[]>(`/api/projects/${projectId}/finance/history`),
      ]);
      setData(finance);
      setHistory(historyRows);
    } catch (err) {
      console.error('Error loading finance:', err);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [finance, historyRows] = await Promise.all([
          apiFetch<IProjectFinance>(`/api/projects/${projectId}/finance`),
          apiFetch<IFinanceHistoryItem[]>(`/api/projects/${projectId}/finance/history`),
        ]);
        if (!cancelled) {
          setData(finance);
          setHistory(historyRows);
        }
      } catch {
        if (!cancelled) setError('Не удалось загрузить финансы');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const onCancelForms = () => {
    setShowInflowForm(false);
    setShowTransferForm(false);
    setEditingInflow(null);
    setEditingTransfer(null);
  };

  const runAction = async (action: () => Promise<unknown>, okMessage: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await action();
      setSuccess(okMessage);
      onCancelForms();
      await reload();
      refetchBudget();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка операции');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    data,
    history,
    loading,
    actionLoading,
    error,
    success,
    showInflowForm,
    showTransferForm,
    editingInflow,
    editingTransfer,
    setShowInflowForm,
    setShowTransferForm,
    setEditingInflow,
    setEditingTransfer,
    clearMessages,
    onCancelForms,
    submitCreateInflow: (payload: {
      date: Date;
      amount: number;
      purpose: 'WORKS' | 'MATERIALS';
      comment: string;
    }) =>
      runAction(
        () =>
          apiFetch<{ inflow: IProjectInflow }>(`/api/projects/${projectId}/finance/inflows`, {
            method: 'POST',
            body: JSON.stringify({
              date: payload.date,
              amount: payload.amount,
              purpose: payload.purpose,
              comment: payload.comment,
            }),
          }),
        'Поступление добавлено'
      ),
    submitUpdateInflow: (
      id: number,
      payload: {
        date: Date;
        amount: number;
        purpose: 'WORKS' | 'MATERIALS';
        comment: string;
      }
    ) =>
      runAction(
        () =>
          apiFetch<{ inflow: IProjectInflow }>(`/api/projects/${projectId}/finance/inflows/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              date: payload.date,
              amount: payload.amount,
              purpose: payload.purpose,
              comment: payload.comment,
            }),
          }),
        'Поступление сохранено'
      ),
    submitDeleteInflow: (id: number) =>
      runAction(() => apiFetch(`/api/projects/${projectId}/finance/inflows/${id}`, { method: 'DELETE' }), 'Поступление удалено'),
    submitCreateTransfer: (payload: {
      date: Date;
      amount: number;
      fromWallet: 'WORKS' | 'MATERIALS';
      toWallet: 'WORKS' | 'MATERIALS';
      comment: string;
    }) =>
      runAction(
        () =>
          apiFetch<{ transfer: IWalletTransfer }>(`/api/projects/${projectId}/finance/transfers`, {
            method: 'POST',
            body: JSON.stringify({
              date: payload.date,
              amount: payload.amount,
              fromWallet: payload.fromWallet,
              toWallet: payload.toWallet,
              comment: payload.comment,
            }),
          }),
        'Перевод добавлен'
      ),
    submitUpdateTransfer: (
      id: number,
      payload: {
        date: Date;
        amount: number;
        fromWallet: 'WORKS' | 'MATERIALS';
        toWallet: 'WORKS' | 'MATERIALS';
        comment: string;
      }
    ) =>
      runAction(
        () =>
          apiFetch<{ transfer: IWalletTransfer }>(`/api/projects/${projectId}/finance/transfers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              date: payload.date,
              amount: payload.amount,
              fromWallet: payload.fromWallet,
              toWallet: payload.toWallet,
              comment: payload.comment,
            }),
          }),
        'Перевод сохранён'
      ),
    submitDeleteTransfer: (id: number) =>
      runAction(() => apiFetch(`/api/projects/${projectId}/finance/transfers/${id}`, { method: 'DELETE' }), 'Перевод удалён'),
  };
};
