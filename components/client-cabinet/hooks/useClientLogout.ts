'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth/logout';

export const useClientLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return { handleLogout };
};
