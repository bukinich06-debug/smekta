'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/authClient';

export const useAdminLogout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
    router.refresh();
  };

  return { handleLogout };
};
