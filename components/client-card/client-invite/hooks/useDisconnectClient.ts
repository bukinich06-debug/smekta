'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { disconnectClient } from '@/services/clients/disconnectClient';

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

    const result = await disconnectClient(clientId);

    setLoading(false);

    if ('error' in result) {
      setError(result.error);
      return;
    }

    setConfirmOpen(false);
    onDisconnected();
    router.refresh();
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
