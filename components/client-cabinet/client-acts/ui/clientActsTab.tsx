'use client';

import { useState, useEffect } from 'react';
import type { IClientProjectActs } from '@/domain/acts';
import type { IFile } from '@/domain/files';
import { ActRow } from '@/components/acts-tab';
import { apiFetch } from '@/components/shared/api';

interface IClientActsTabProps {
  data: IClientProjectActs;
}

export const ClientActsTab = ({ data }: IClientActsTabProps) => {
  const [attachments, setAttachments] = useState<IFile[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(true);

  useEffect(() => {
    const loadAttachments = async () => {
      try {
        const files = await apiFetch<IFile[]>('/api/client/acts/files');
        setAttachments(files);
      } catch (err) {
        console.error('Ошибка загрузки вложений:', err);
      } finally {
        setAttachmentsLoading(false);
      }
    };

    loadAttachments();
  }, []);

  const reloadAttachments = async () => {
    try {
      const files = await apiFetch<IFile[]>('/api/client/acts/files');
      setAttachments(files);
    } catch (err) {
      console.error('Ошибка обновления вложений:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Акты выполненных работ</h2>

      {data.acts.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>Актов пока нет</p>
        </div>
      )}

      {data.acts.map((act) => (
        <ActRow
          key={act.id}
          act={{
            ...act,
            projectId: data.projectId,
          }}
          loading={false}
          readOnly
          onEdit={() => {}}
          onDelete={() => {}}
          onStatusChange={() => {}}
          allFiles={attachments}
          onReloadFiles={reloadAttachments}
          filesLoading={attachmentsLoading}
        />
      ))}
    </div>
  );
};
