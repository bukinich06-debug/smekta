'use client';

import { usePathname } from 'next/navigation';
import { MENU_ITEMS } from '../constants/menuItems';

export const useAdminNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return { items: MENU_ITEMS, isActive };
};
