'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const readTabFromLocation = () => new URLSearchParams(window.location.search).get('tab');

interface IUseUrlTabParams {
  defaultTab: string;
  validTabIds: string[];
}

export const useUrlTab = ({ defaultTab, validTabIds }: IUseUrlTabParams) => {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const resolveTab = useCallback(
    (tab: string | null) => {
      if (tab && validTabIds.includes(tab)) return tab;
      return defaultTab;
    },
    [defaultTab, validTabIds],
  );

  const [activeTab, setActiveTabState] = useState(() => resolveTab(tabFromUrl));

  useEffect(() => {
    const onPopState = () => setActiveTabState(resolveTab(readTabFromLocation()));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [resolveTab]);

  const setActiveTab = useCallback(
    (tabId: string) => {
      if (!validTabIds.includes(tabId)) return;

      setActiveTabState(tabId);
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tabId);
      const query = params.toString();
      const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, '', url);
    },
    [validTabIds],
  );

  return { activeTab, setActiveTab };
};
