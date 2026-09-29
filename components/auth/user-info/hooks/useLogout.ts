'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth/logout';

export const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    router.push('/login');
  };

  return {
    isLoading,
    handleLogout,
  };
};
