'use client';

import { useUrlTab } from '@/components/shared/hooks/useUrlTab';

const TABS = [
  { id: 'tz', label: 'ТЗ' },
  { id: 'estimate', label: 'Смета' },
  { id: 'receipts', label: 'Чеки' },
  { id: 'acts', label: 'Акты' },
  { id: 'extra', label: 'Допработы' },
  { id: 'finance', label: 'Финансы' },
  { id: 'photos', label: 'Фото' },
];

const TAB_IDS = TABS.map((tab) => tab.id);

export const useClientCabinetTabs = () => {
  const { activeTab, setActiveTab } = useUrlTab({ defaultTab: 'tz', validTabIds: TAB_IDS });

  return { activeTab, tabs: TABS, setActiveTab };
};
