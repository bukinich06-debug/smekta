export interface IMenuItem {
  label: string;
  href: string;
}

export const MENU_ITEMS: IMenuItem[] = [
  { label: 'Заказчики', href: '/admin/clients' },
  { label: 'Статистика', href: '/admin/stats' },
];
