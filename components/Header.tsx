import React from 'react';
import Icon from './Icon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <Icon icon="calculator" className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Simple Tax Estimator
        </h1>
      </div>
    </header>
  );
};

export default Header;