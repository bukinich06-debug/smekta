'use client';

import { useState } from 'react';
import { generateInviteToken } from '@/services/clients/generateInviteToken';

interface IUseClientInviteParams {
  clientId: number;
}

export const useClientInvite = ({ clientId }: IUseClientInviteParams) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const result = await generateInviteToken(clientId);

      if ('error' in result) {
        setError(result.error);
        setInviteUrl(null);
      } else {
        const origin = window.location.origin;
        const url = `${origin}/invite/${result.token}`;
        setInviteUrl(url);
      }
    } catch {
      setError('Не удалось сгенерировать ссылку');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Не удалось скопировать');
    }
  };

  return {
    loading,
    error,
    inviteUrl,
    copied,
    generate,
    copyToClipboard,
  };
};
