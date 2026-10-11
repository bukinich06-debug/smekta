'use client';

import { useUrlTab } from '@/components/shared/hooks/useUrlTab';

const TABS = [
  { id: 'tz', label: 'ТЗ / Проект' },
  { id: 'estimate', label: 'Смета' },
  { id: 'receipts', label: 'Чеки' },
  { id: 'acts', label: 'Акты выполненных работ' },
  { id: 'extra', label: 'Дополнительные работы' },
  { id: 'finance', label: 'Финансы' },
  { id: 'photos', label: 'Фото' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

export const useCardTabs = () => {
  const { activeTab, setActiveTab } = useUrlTab({ defaultTab: 'tz', validTabIds: TAB_IDS });

  return { activeTab, tabs: TABS, setActiveTab };
};
