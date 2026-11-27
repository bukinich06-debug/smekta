'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/components/shared/api';

interface IUseDisconnectClientParams {
  clientId: number;
  onDisconnected: () => void;
}

export const useDisconnectClient = ({ clientId, onDisconnected }: IUseDisconnectClientParams) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openConfirm = () => {
    setError(null);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (loading) return;
    setConfirmOpen(false);
  };

  const confirmDisconnect = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ ok: boolean }>(`/api/clients/${clientId}/disconnect`, {
        method: 'POST',
      });

      setConfirmOpen(false);
      onDisconnected();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ошибка при отключении');
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmOpen,
    loading,
    error,
    openConfirm,
    closeConfirm,
    confirmDisconnect,
  };
};
