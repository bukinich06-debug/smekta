'use client';

import { useCardTabs } from '../hooks/useCardTabs';
import { EstimateTab } from '@/components/estimate-tab';
import { ReceiptsTab } from '@/components/receipts-tab';
import { AdminTzTab } from '@/components/tz-tab';
import { ExtraWorksTab } from '@/components/extra-works-tab';
import { ActsTab } from '@/components/acts-tab';
import { FinanceTab } from '@/components/finance-tab';
import { AdminPhotosTab } from '@/components/photos-tab';

interface ICardTabsProps {
  projectId: number;
}

export const CardTabs = ({ projectId }: ICardTabsProps) => {
  const { activeTab, tabs, setActiveTab } = useCardTabs();

  const isPlaceholder =
    activeTab !== 'estimate' &&
    activeTab !== 'tz' &&
    activeTab !== 'receipts' &&
    activeTab !== 'extra' &&
    activeTab !== 'acts' &&
    activeTab !== 'finance' &&
    activeTab !== 'photos';

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'estimate' && <EstimateTab projectId={projectId} />}
        {activeTab === 'tz' && <AdminTzTab projectId={projectId} />}
        {activeTab === 'receipts' && <ReceiptsTab projectId={projectId} />}
        {activeTab === 'extra' && <ExtraWorksTab projectId={projectId} />}
        {activeTab === 'acts' && <ActsTab projectId={projectId} />}
        {activeTab === 'finance' && <FinanceTab projectId={projectId} />}
        {activeTab === 'photos' && <AdminPhotosTab projectId={projectId} />}
        {isPlaceholder && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Содержимое вкладки будет реализовано позднее</p>
          </div>
        )}
      </div>
    </div>
  );
};
