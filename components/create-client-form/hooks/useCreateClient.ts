'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/components/shared/api';
import type { ICreateClientInput, IClientWithProject } from '@/domain/clients';
import type { ProjectStatus } from '@prisma/client';

export const useCreateClient = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ICreateClientInput>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    projectName: '',
    projectStatus: 'PLANNING' as ProjectStatus,
    startDate: null,
  });

  const updateField = <K extends keyof ICreateClientInput>(
    field: K,
    value: ICreateClientInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch<{ client: IClientWithProject }>('/api/clients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      router.push('/admin/clients');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Неизвестная ошибка');
      setLoading(false);
    }
  };

  return { formData, updateField, submit, loading, error };
};
