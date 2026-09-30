'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvite } from '@/services/clients/acceptInvite';

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
      const result = await acceptInvite(token);

      if (result.success) {
        router.push('/client');
      } else {
        setError(result.error || 'Не удалось подключиться к проекту');
      }
    } catch {
      setError('Не удалось подключиться к проекту');
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
