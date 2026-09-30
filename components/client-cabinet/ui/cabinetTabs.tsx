'use client';

import type { IClientProjectEstimate } from '@/domain/estimates';
import type { IProjectReceipts } from '@/domain/receipts';
import { useClientCabinetTabs } from '../hooks/useClientCabinetTabs';
import { ClientEstimateTab } from '../client-estimate';
import { ClientReceiptsTab } from '../client-receipts';

interface ICabinetTabsProps {
  estimate: IClientProjectEstimate;
  receipts: IProjectReceipts;
}

export const CabinetTabs = ({ estimate, receipts }: ICabinetTabsProps) => {
  const { activeTab, tabs, setActiveTab } = useClientCabinetTabs();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
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
        {activeTab === 'estimate' && <ClientEstimateTab data={estimate} />}
        {activeTab === 'receipts' && <ClientReceiptsTab data={receipts} />}
        {activeTab !== 'estimate' && activeTab !== 'receipts' && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Скоро</p>
          </div>
        )}
      </div>
    </div>
  );
};
