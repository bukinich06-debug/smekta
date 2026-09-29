'use client';

import { useCardTabs } from '../hooks/useCardTabs';

export const CardTabs = () => {
  const { activeTab, tabs, setActiveTab } = useCardTabs();

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
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg">Содержимое вкладки будет реализовано позднее</p>
        </div>
      </div>
    </div>
  );
};
