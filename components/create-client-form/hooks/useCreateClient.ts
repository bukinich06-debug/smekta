'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/services/clients/createClient';
import type { ICreateClientInput } from '@/domain/clients';
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

    const result = await createClient(formData);

    if (!result.ok) {
      setError(result.error || 'Неизвестная ошибка');
      setLoading(false);
      return;
    }

    router.push('/admin/clients');
    router.refresh();
  };

  return { formData, updateField, submit, loading, error };
};
