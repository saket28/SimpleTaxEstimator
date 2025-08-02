import React from 'react';
import { CREDIT_GROUPS } from '../constants';
import type { CreditData } from '../types';
import IncomeInput from './IncomeInput';

interface StepCreditsProps {
    credits: CreditData;
    onCreditChange: (name: string, value: string) => void;
}

const StepCredits: React.FC<StepCreditsProps> = ({ credits, onCreditChange }) => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tax Credits</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Enter any tax credits you may qualify for. These reduce your tax dollar-for-dollar.</p>
            </div>
            
            {Object.entries(CREDIT_GROUPS).map(([type, group]) => (
                <div key={type}>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{group.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{group.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.items.map((item) => (
                            <IncomeInput
                                key={item.key}
                                name={item.key as string}
                                label={item.label}
                                icon={item.icon}
                                value={credits[item.key as keyof CreditData] === 0 ? '' : credits[item.key as keyof CreditData].toString()}
                                onChange={(e) => onCreditChange(item.key, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StepCredits;
