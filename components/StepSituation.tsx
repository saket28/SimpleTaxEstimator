import React from 'react';
import { FILING_STATUSES } from '../constants';
import type { FilingStatus } from '../types';

interface StepSituationProps {
    filingStatus: FilingStatus;
    setFilingStatus: (status: FilingStatus) => void;
    age: string;
    setAge: (age: string) => void;
    spouseAge: string;
    setSpouseAge: (age: string) => void;
}

const StepSituation: React.FC<StepSituationProps> = ({
    filingStatus,
    setFilingStatus,
    age,
    setAge,
    spouseAge,
    setSpouseAge,
}) => {
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Situation</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Let's start with some basic information.</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
                <div>
                    <label htmlFor="filingStatus" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Filing Status</label>
                    <select
                        id="filingStatus"
                        name="filingStatus"
                        value={filingStatus}
                        onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md border-slate-300 bg-white text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {FILING_STATUSES.map(status => (
                        <option key={status.key} value={status.key}>{status.label}</option>
                        ))}
                    </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                         <label htmlFor="userAge" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Age</label>
                        <input
                            type="number"
                            id="userAge"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-2 py-2 text-base rounded-md border-slate-300 bg-white text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="e.g., 35"
                            min="0"
                        />
                    </div>
                     {filingStatus === 'marriedFilingJointly' && (
                        <div className="animate-fade-in">
                            <label htmlFor="spouseAge" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Spouse's Age</label>
                            <input
                                type="number"
                                id="spouseAge"
                                value={spouseAge}
                                onChange={(e) => setSpouseAge(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-2 py-2 text-base rounded-md border-slate-300 bg-white text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder="e.g., 35"
                                min="0"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepSituation;
