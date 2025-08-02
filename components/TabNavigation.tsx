import React from 'react';
import Icon, { IconType } from './Icon';

type Tab = 'situation' | 'income' | 'deductions' | 'credits' | 'results';

interface TabNavigationProps {
    activeTab: Tab;
    navigateTo: (tab: Tab) => void;
    visitedTabs: Set<Tab>;
}

const TABS: { id: Tab; name: string; icon: IconType }[] = [
    { id: 'situation', name: 'Situation', icon: 'user-group' },
    { id: 'income', name: 'Income', icon: 'circle-dollar' },
    { id: 'deductions', name: 'Deductions', icon: 'clipboard' },
    { id: 'credits', name: 'Credits', icon: 'hand-holding-dollar' },
    { id: 'results', name: 'Results', icon: 'calculator' },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, navigateTo, visitedTabs }) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-1 sm:space-x-4 justify-center" aria-label="Tabs">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const isVisited = visitedTabs.has(tab.id);
                    return (
                        <button
                            key={tab.name}
                            onClick={() => isVisited && navigateTo(tab.id)}
                            className={`
                                ${isActive
                                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                                }
                                ${!isVisited ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                                group inline-flex items-center py-4 px-1 sm:px-2 border-b-2 font-medium text-sm transition-colors
                            `}
                            aria-current={isActive ? 'page' : undefined}
                            disabled={!isVisited}
                        >
                            <Icon 
                                icon={tab.icon} 
                                className={`
                                    ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-300'}
                                    -ml-0.5 mr-2 h-5 w-5
                                `}
                            />
                            <span>{tab.name}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default TabNavigation;
