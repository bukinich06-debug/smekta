'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export const useCardTabs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'tz';

  const tabs = [
    { id: 'tz', label: 'ТЗ / Проект' },
    { id: 'estimate', label: 'Смета' },
    { id: 'receipts', label: 'Чеки' },
    { id: 'acts', label: 'Акты выполненных работ' },
    { id: 'extra', label: 'Дополнительные работы' },
    { id: 'photos', label: 'Фото' },
  ];

  const setActiveTab = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`?${params.toString()}`);
  };

  return { activeTab, tabs, setActiveTab };
};
