'use client';

import type { IClientProjectEstimate } from '@/domain/estimates';
import { formatMoney } from '../helpers/formatMoney';
import { ClientEstimateSection } from './clientEstimateSection';
import { useCollapsedSections } from '@/components/shared/hooks/useCollapsedSections';

interface IClientEstimateTabProps {
  data: IClientProjectEstimate;
}

export const ClientEstimateTab = ({ data }: IClientEstimateTabProps) => {
  const {
    isCollapsed,
    toggleSection,
    collapseAll,
    expandAll,
    allCollapsed,
  } = useCollapsedSections(data.projectId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Смета проекта</h2>
        {data.sections.length > 0 && (
          <button
            onClick={() => {
              const sectionIds = data.sections.map(s => s.id);
              if (allCollapsed(sectionIds)) {
                expandAll();
              } else {
                collapseAll(sectionIds);
              }
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {allCollapsed(data.sections.map(s => s.id)) ? 'Развернуть все' : 'Свернуть все'}
          </button>
        )}
      </div>

      {data.sections.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>Пока нет позиций, доступных для просмотра.</p>
        </div>
      )}

      {data.sections.map((section) => (
        <ClientEstimateSection 
          key={section.id} 
          section={section}
          isCollapsed={isCollapsed(section.id)}
          onToggleCollapse={() => toggleSection(section.id)}
        />
      ))}

      {data.sections.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Итого по смете:</span>
            <span className="text-2xl font-bold text-blue-600">{formatMoney(data.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
