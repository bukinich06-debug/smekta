'use client';

import { useState } from 'react';
import type { IUpdateClientCardInput } from '@/domain/clients';
import { updateClientCard } from '@/services/clients/updateClientCard';
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

    const result = await updateClientCard(clientId, projectId, formData);

    setLoading(false);

    if (result.ok) {
      setSuccess(true);
      setIsEditing(false);
      router.refresh();
    } else {
      setError(result.error || 'Ошибка при сохранении');
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
