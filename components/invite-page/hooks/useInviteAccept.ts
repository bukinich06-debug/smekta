'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/components/shared/api';

interface IUseInviteAcceptParams {
  token: string;
}

export const useInviteAccept = ({ token }: IUseInviteAcceptParams) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ success: boolean }>(`/api/invite/${token}/accept`, {
        method: 'POST',
      });

      router.push('/client');
    } catch (err: any) {
      setError(err.message || 'Не удалось подключиться к проекту');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    accept,
  };
};
