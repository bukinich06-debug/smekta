'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/authClient';

const isValidCallback = (url: string): boolean => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin && parsed.pathname.startsWith('/');
  } catch {
    return false;
  }
};

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      const callback = searchParams.get('callback');
      const redirectUrl = callback && isValidCallback(callback) ? callback : '/';
      router.push(redirectUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неверный email или пароль';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
