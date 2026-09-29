'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/auth/register';

export const useRegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register({ name, email, password });

    if (result.ok) {
      router.push('/');
    } else {
      setError(result.error || 'Ошибка при регистрации');
    }

    setIsLoading(false);
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
