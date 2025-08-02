import React from 'react';
import { INCOME_GROUPS } from '../constants';
import type { IncomeData } from '../types';
import IncomeInput from './IncomeInput';

interface StepIncomeProps {
    income: IncomeData;
    onIncomeChange: (name: string, value: string) => void;
}

const StepIncome: React.FC<StepIncomeProps> = ({ income, onIncomeChange }) => {
    const totalIncome = Object.values(income).reduce((acc: number, current: number) => acc + current, 0);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Income</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Enter your annual gross income from all sources.</p>
            </div>
            
            {INCOME_GROUPS.map((group) => (
                <div key={group.title}>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{group.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{group.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.sources.map((source) => (
                            <IncomeInput
                                key={source.key}
                                name={source.key as string}
                                label={source.label}
                                icon={source.icon}
                                value={income[source.key] === 0 ? '' : income[source.key].toString()}
                                onChange={(e) => onIncomeChange(source.key, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            ))}

             <div className="pt-4 mt-8 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold text-lg text-slate-600 dark:text-slate-300">Total Gross Income:</span>
                  <span className="font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                    {totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
        </div>
    );
};

export default StepIncome;
