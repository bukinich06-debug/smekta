'use client';

import type { IClientProjectActs } from '@/domain/acts';
import { ActRow } from '@/components/acts-tab';

interface IClientActsTabProps {
  data: IClientProjectActs;
}

export const ClientActsTab = ({ data }: IClientActsTabProps) => (
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
        act={act}
        loading={false}
        readOnly
        onEdit={() => {}}
        onDelete={() => {}}
        onStatusChange={() => {}}
      />
    ))}
  </div>
);
