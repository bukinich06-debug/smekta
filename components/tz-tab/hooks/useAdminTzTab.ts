'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IProjectTz, IProjectTzHistoryItem } from '@/domain/project-tz';
import { getProjectTz } from '@/services/project-tz/getProjectTz';
import { listProjectTzHistory } from '@/services/project-tz/listProjectTzHistory';
import { updateProjectTz } from '@/services/project-tz/updateProjectTz';

export const useAdminTzTab = (projectId: number) => {
  const router = useRouter();
  const [tz, setTz] = useState<IProjectTz | null>(null);
  const [history, setHistory] = useState<IProjectTzHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tzData, historyData] = await Promise.all([
        getProjectTz(projectId),
        listProjectTzHistory(projectId),
      ]);
      setTz(tzData);
      setHistory(historyData);
      if (tzData) setDraft(tzData.text ?? '');
    } catch (err) {
      console.error('Ошибка при загрузке ТЗ:', err);
      setError('Не удалось загрузить данные вкладки.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tzData, historyData] = await Promise.all([
          getProjectTz(projectId),
          listProjectTzHistory(projectId),
        ]);
        if (cancelled) return;
        setTz(tzData);
        setHistory(historyData);
        if (tzData) setDraft(tzData.text ?? '');
      } catch (err) {
        if (!cancelled) {
          console.error('Ошибка при загрузке ТЗ:', err);
          setError('Не удалось загрузить данные вкладки.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const startEdit = () => {
    setDraft(tz?.text ?? '');
    setIsEditing(true);
    setError(null);
  };

  const cancelEdit = () => {
    setDraft(tz?.text ?? '');
    setIsEditing(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const result = await updateProjectTz(projectId, draft);
    setSaving(false);

    if (!result.ok) {
      setError(result.error || 'Не удалось сохранить.');
      return;
    }

    if (result.data) setTz(result.data);
    setIsEditing(false);
    await load();
    router.refresh();
  };

  return {
    tz,
    history,
    loading,
    isEditing,
    draft,
    setDraft,
    saving,
    error,
    startEdit,
    cancelEdit,
    save,
  };
};
