'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export const useClientCabinetTabs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'tz';

  const tabs = [
    { id: 'tz', label: 'ТЗ' },
    { id: 'estimate', label: 'Смета' },
    { id: 'receipts', label: 'Чеки' },
    { id: 'acts', label: 'Акты' },
    { id: 'extra', label: 'Допработы' },
    { id: 'finance', label: 'Финансы' },
    { id: 'photos', label: 'Фото' },
  ];

  const setActiveTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`?${params.toString()}`);
  };

  return { activeTab, tabs, setActiveTab };
};
