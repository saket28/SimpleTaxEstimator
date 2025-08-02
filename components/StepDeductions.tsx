import React from 'react';
import { DEDUCTION_GROUPS } from '../constants';
import type { DeductionsData } from '../types';
import IncomeInput from './IncomeInput';

interface StepDeductionsProps {
    deductions: DeductionsData;
    onDeductionChange: (name: string, value: string) => void;
}

const StepDeductions: React.FC<StepDeductionsProps> = ({ deductions, onDeductionChange }) => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Above-the-Line Deductions</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Enter any adjustments that reduce your gross income to find your AGI.</p>
            </div>
            
            {DEDUCTION_GROUPS.map((group) => (
                <div key={group.title}>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{group.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{group.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {group.items.map((item) => (
                            <IncomeInput
                                key={item.key}
                                name={item.key as string}
                                label={item.label}
                                icon={item.icon}
                                value={deductions[item.key as keyof DeductionsData] === 0 ? '' : deductions[item.key as keyof DeductionsData].toString()}
                                onChange={(e) => onDeductionChange(item.key, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StepDeductions;
