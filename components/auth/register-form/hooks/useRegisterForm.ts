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

export const useRegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      const callback = searchParams.get('callback');
      const redirectUrl = callback && isValidCallback(callback) ? callback : '/';
      router.push(redirectUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при регистрации';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  };
};
