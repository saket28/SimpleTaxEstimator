import React from 'react';
import type { TaxData } from '../types';

interface StepResultsProps {
  data: TaxData | null;
  error: string | null;
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return '$0.00';
  const options = { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  if (value < 0) {
      return `-${Math.abs(value).toLocaleString('en-US', options)}`;
  }
  return value.toLocaleString('en-US', options);
};

const CalculationRow: React.FC<{ label: string; value: string | number; isBold?: boolean; isSubtracted?: boolean; isTotal?: boolean; className?: string }> = ({ label, value, isBold, isSubtracted, isTotal, className }) => (
  <div className={`flex justify-between items-center py-3 ${isTotal ? 'border-t-2 border-slate-300 dark:border-slate-600' : 'border-b border-slate-200 dark:border-slate-700'} ${className}`}>
    <span className={`text-sm ${isBold ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
    <span className={`font-mono text-base ${isBold ? 'font-bold text-slate-900 dark:text-slate-50' : 'text-slate-700 dark:text-slate-300'}`}>
      {isSubtracted && '- '}{typeof value === 'number' ? formatCurrency(value) : value}
    </span>
  </div>
);

const StepResults: React.FC<StepResultsProps> = ({ data, error, isLoading }) => {
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-lg text-center animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="font-semibold">Calculation Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg animate-fade-in">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">AI is crunching the numbers...</p>
          </div>
      )
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7c0-1.1.9-2 2-2h11a2 2 0 012 2v8a2 2 0 01-2 2h-2z" /></svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Awaiting Calculation</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click 'Calculate' to see your federal tax estimate.</p>
      </div>
    );
  }

  const isRefund = data.finalTaxOrRefund < 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg h-full flex flex-col space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">Federal Tax Estimate</h2>
      
      {/* Calculation Flow */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Calculation Summary</h3>
        <div className="space-y-1">
          <CalculationRow label="Total Gross Income" value={data.totalIncome} />
          <CalculationRow label="Above-the-Line Deductions" value={data.totalAboveTheLineDeductions} isSubtracted />
          <CalculationRow label="Adjusted Gross Income (AGI)" value={data.adjustedGrossIncome} isBold isTotal />
          <CalculationRow label="Standard Deduction" value={data.standardDeduction} isSubtracted className="mt-2" />
          <CalculationRow label="Taxable Income" value={data.taxableIncome} isBold isTotal />
          <CalculationRow label="Initial Federal Tax" value={data.initialFederalTax} className="mt-2"/>
          <CalculationRow label="Nonrefundable Credits" value={data.totalNonrefundableCredits} isSubtracted />
          <CalculationRow label="Tax after Nonrefundable Credits" value={data.taxAfterNonrefundableCredits} isBold isTotal />
          <CalculationRow label="Refundable Credits" value={data.totalRefundableCredits} isSubtracted className="mt-2"/>
        </div>
      </div>
      
      {/* Final Summary */}
      <div className="space-y-3 pt-4">
        <div className={`flex justify-between items-baseline p-4 rounded-lg shadow-lg ${isRefund ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
          <span className={`font-semibold text-lg ${isRefund ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
            {isRefund ? 'Estimated Refund' : 'Estimated Tax Due'}
          </span>
          <span className={`font-extrabold text-2xl ${isRefund ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(Math.abs(data.finalTaxOrRefund))}
          </span>
        </div>
        <div className="flex justify-between items-baseline text-sm">
          <span className="text-slate-500 dark:text-slate-400">Effective Tax Rate:</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{data.effectiveTaxRate.toFixed(2)}%</span>
        </div>
      </div>

      {/* Ordinary Income Tax Bracket Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 mt-4">Ordinary Income Tax Brackets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="px-4 py-2">Rate</th>
                <th scope="col" className="px-4 py-2 text-right">Income in Bracket</th>
                <th scope="col" className="px-4 py-2 text-right">Tax</th>
              </tr>
            </thead>
            <tbody>
              {data.taxBrackets.map((bracket, index) => (
                <tr key={index} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                  <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">{bracket.rate}%</td>
                  <td className="px-4 py-2 text-right font-mono">{formatCurrency(bracket.incomeInBracket)}</td>
                  <td className="px-4 py-2 text-right font-mono">{formatCurrency(bracket.taxOnIncome)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Tax by Income Source */}
      {data.incomeTaxDetails && data.incomeTaxDetails.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2 mt-4">Tax by Income Source (Pre-Credits)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 uppercase bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-4 py-2">Source</th>
                  <th scope="col" className="px-4 py-2">Tax Type</th>
                  <th scope="col" className="px-4 py-2 text-right">Amount</th>
                  <th scope="col" className="px-4 py-2 text-right">Estimated Tax</th>
                </tr>
              </thead>
              <tbody>
                {data.incomeTaxDetails.filter(d => d.amount > 0).map((detail, index) => (
                  <tr key={index} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">{detail.sourceName}</td>
                    <td className="px-4 py-2">
                       <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          detail.taxType === 'Preferential' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
                        }`}>
                          {detail.taxType}
                        </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">{formatCurrency(detail.amount)}</td>
                    <td className="px-4 py-2 text-right font-mono">{formatCurrency(detail.estimatedTax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepResults;
