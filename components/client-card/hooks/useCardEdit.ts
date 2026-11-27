'use client';

import { useState } from 'react';
import type { IUpdateClientCardInput } from '@/domain/clients';
import { apiFetch } from '@/components/shared/api';
import { useRouter } from 'next/navigation';

interface IUseCardEditParams {
  clientId: number;
  projectId: number;
  initialData: IUpdateClientCardInput;
}

export const useCardEdit = ({ clientId, projectId, initialData }: IUseCardEditParams) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateClientCardInput>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const updateField = <K extends keyof IUpdateClientCardInput>(
    field: K,
    value: IUpdateClientCardInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const startEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData(initialData);
    setError(null);
  };

  const save = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiFetch<{ ok: boolean }>(`/api/clients/${clientId}`, {
        method: 'PATCH',
        body: JSON.stringify({ projectId, ...formData }),
      });

      setSuccess(true);
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing,
    formData,
    loading,
    error,
    success,
    updateField,
    startEdit,
    cancelEdit,
    save,
  };
};
