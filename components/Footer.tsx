import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-8 py-6 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p className="font-semibold">Disclaimer</p>
        <p className="mt-1 max-w-2xl mx-auto">
          This tool provides an estimate for informational purposes only and should not be considered financial or tax advice. The calculations are based on AI and may not reflect all nuances of your individual tax situation. Consult with a qualified professional for tax planning.
        </p>
      </div>
    </footer>
  );
};

export default Footer;