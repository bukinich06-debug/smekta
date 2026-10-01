'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IFinanceHistoryItem, IProjectFinance, IProjectInflow, IWalletTransfer } from '@/domain/finance';
import { getProjectFinance } from '@/services/finance/getProjectFinance';
import { listProjectFinanceHistory } from '@/services/finance/listProjectFinanceHistory';
import { createInflow } from '@/services/finance/createInflow';
import { updateInflow } from '@/services/finance/updateInflow';
import { deleteInflow } from '@/services/finance/deleteInflow';
import { createWalletTransfer } from '@/services/finance/createWalletTransfer';
import { updateWalletTransfer } from '@/services/finance/updateWalletTransfer';
import { deleteWalletTransfer } from '@/services/finance/deleteWalletTransfer';

export const useFinanceTab = (projectId: number) => {
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
    const [finance, historyRows] = await Promise.all([
      getProjectFinance(projectId),
      listProjectFinanceHistory(projectId),
    ]);
    setData(finance);
    setHistory(historyRows);
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [finance, historyRows] = await Promise.all([
          getProjectFinance(projectId),
          listProjectFinanceHistory(projectId),
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

  const runAction = async (action: () => Promise<{ ok: boolean; error?: string }>, okMessage: string) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    const result = await action();
    setActionLoading(false);

    if (!result.ok) {
      setError(result.error || 'Ошибка операции');
      return;
    }

    setSuccess(okMessage);
    onCancelForms();
    await reload();
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
          createInflow({
            projectId,
            date: payload.date,
            amount: payload.amount,
            purpose: payload.purpose,
            comment: payload.comment,
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
          updateInflow(id, {
            date: payload.date,
            amount: payload.amount,
            purpose: payload.purpose,
            comment: payload.comment,
          }),
        'Поступление сохранено'
      ),
    submitDeleteInflow: (id: number) =>
      runAction(() => deleteInflow(id), 'Поступление удалено'),
    submitCreateTransfer: (payload: {
      date: Date;
      amount: number;
      fromWallet: 'WORKS' | 'MATERIALS';
      toWallet: 'WORKS' | 'MATERIALS';
      comment: string;
    }) =>
      runAction(
        () =>
          createWalletTransfer({
            projectId,
            date: payload.date,
            amount: payload.amount,
            fromWallet: payload.fromWallet,
            toWallet: payload.toWallet,
            comment: payload.comment,
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
          updateWalletTransfer(id, {
            date: payload.date,
            amount: payload.amount,
            fromWallet: payload.fromWallet,
            toWallet: payload.toWallet,
            comment: payload.comment,
          }),
        'Перевод сохранён'
      ),
    submitDeleteTransfer: (id: number) =>
      runAction(() => deleteWalletTransfer(id), 'Перевод удалён'),
  };
};
