'use client';

import type { IClientProjectExtraWorks } from '@/domain/extra-works';
import { ExtraWorksTotals, ExtraWorkRow } from '@/components/extra-works-tab';

interface IClientExtraWorksTabProps {
  data: IClientProjectExtraWorks;
}

export const ClientExtraWorksTab = ({ data }: IClientExtraWorksTabProps) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Дополнительные работы</h2>

    <ExtraWorksTotals total={data.total} budgetTotal={data.budgetTotal} />

    {data.items.length === 0 && (
      <div className="text-center text-gray-500 py-12">
        <p>Дополнительных работ пока нет</p>
      </div>
    )}

    {data.items.map((work) => (
      <ExtraWorkRow
        key={work.id}
        work={{
          ...work,
          projectId: data.projectId,
          isVisibleToClient: true,
        }}
        loading={false}
        readOnly
        onEdit={() => {}}
        onDelete={() => {}}
        onToggleStatus={() => {}}
        onMarkDone={() => {}}
        onUnmarkDone={() => {}}
        onToggleVisibility={() => {}}
        onToggleBudget={() => {}}
      />
    ))}
  </div>
);
