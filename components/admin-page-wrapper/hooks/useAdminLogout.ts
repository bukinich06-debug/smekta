'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/services/auth/logout';

export const useAdminLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };

  return { handleLogout };
};
