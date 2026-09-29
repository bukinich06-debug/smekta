'use client';

import type { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { useAdminLogout } from '../hooks/useAdminLogout';

interface IAdminPageWrapperProps {
  children: ReactNode;
  userName: string;
}

export const AdminPageWrapper = ({ children, userName }: IAdminPageWrapperProps) => {
  const { handleLogout } = useAdminLogout();

  return (
    <AdminLayout userName={userName} onLogout={handleLogout}>
      {children}
    </AdminLayout>
  );
};
