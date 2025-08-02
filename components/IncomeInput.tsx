import React from 'react';
import Icon, { IconType } from './Icon';

interface IncomeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: IconType;
  description?: string;
}

const IncomeInput: React.FC<IncomeInputProps> = ({ label, icon, description, ...props }) => {
  return (
    <div>
      <label htmlFor={props.name} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        <Icon icon={icon} className="h-4 w-4 mr-2 text-slate-400 dark:text-slate-500" />
        {label}
      </label>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{description}</p>}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          id={props.name}
          className="block w-full rounded-md border-slate-300 bg-white text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-7 pr-4 py-2 text-base placeholder:text-slate-400"
          placeholder="0.00"
          min="0"
          {...props}
        />
      </div>
    </div>
  );
};

export default IncomeInput;