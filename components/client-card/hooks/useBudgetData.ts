import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/components/shared/api';
import type { IProjectFinance } from '@/domain/finance';

interface IBudgetData {
  estimateTotal: number;
  receivedTotal: number;
  masteredTotal: number;
  balanceOnHand: number;
  dueNow: number;
  stillNeededForWorks: number;
}

interface IUseBudgetDataResult {
  data: IBudgetData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useBudgetData = (projectId: number | null): IUseBudgetDataResult => {
  const [data, setData] = useState<IBudgetData | null>(null);
  const [loading, setLoading] = useState(!!projectId);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      if (isFirstLoadRef.current) {
        setLoading(true);
        isFirstLoadRef.current = false;
      }
      setError(null);

      try {
        const result = await apiFetch<IProjectFinance>(`/api/projects/${projectId}/finance`);
        setData(result.summary);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные бюджета');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, refetchTrigger]);

  const refetch = () => {
    if (projectId) setRefetchTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
};
