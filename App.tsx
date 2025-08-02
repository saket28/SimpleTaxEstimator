import React, { useState, useMemo, useCallback } from 'react';
import type { IncomeData, TaxData, FilingStatus, DeductionsData, CreditData } from './types';
import { INITIAL_INCOME_STATE, INITIAL_DEDUCTIONS_STATE, INITIAL_CREDITS_STATE } from './constants';
import { calculateTaxesFromGemini } from './services/geminiService';
import Header from './components/Header';
import Footer from './components/Footer';
import TabNavigation from './components/TabNavigation';
import StepSituation from './components/StepSituation';
import StepIncome from './components/StepIncome';
import StepDeductions from './components/StepDeductions';
import StepCredits from './components/StepCredits';
import StepResults from './components/StepResults';
import Icon from './components/Icon';

type Tab = 'situation' | 'income' | 'deductions' | 'credits' | 'results';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('situation');
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(new Set(['situation']));

  // State for all steps
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [age, setAge] = useState<string>('');
  const [spouseAge, setSpouseAge] = useState<string>('');
  const [income, setIncome] = useState<IncomeData>(INITIAL_INCOME_STATE);
  const [deductions, setDeductions] = useState<DeductionsData>(INITIAL_DEDUCTIONS_STATE);
  const [credits, setCredits] = useState<CreditData>(INITIAL_CREDITS_STATE);
  
  // State for results
  const [taxBreakdown, setTaxBreakdown] = useState<TaxData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleIncomeChange = useCallback((name: string, value: string) => {
    setIncome(prev => ({ ...prev, [name]: Number(value) || 0 }));
  }, []);
  
  const handleDeductionChange = useCallback((name: string, value: string) => {
    setDeductions(prev => ({ ...prev, [name]: Number(value) || 0 }));
  }, []);

  const handleCreditChange = useCallback((name: string, value: string) => {
    setCredits(prev => ({ ...prev, [name]: Number(value) || 0 }));
  }, []);

  const navigateTo = (tab: Tab) => {
    if (visitedTabs.has(tab)) {
      setActiveTab(tab);
    }
  };
  
  const handleNext = () => {
    const tabs: Tab[] = ['situation', 'income', 'deductions', 'credits', 'results'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      setVisitedTabs(prev => new Set(prev).add(nextTab));
      setActiveTab(nextTab);
    }
  };
  
  const handlePrevious = () => {
    const tabs: Tab[] = ['situation', 'income', 'deductions', 'credits', 'results'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleCalculate = async () => {
     if (!age || Number(age) <= 0) {
        setError("Please go back to the 'Situation' tab and enter a valid age.");
        setActiveTab('situation');
        return;
    }
    
    setActiveTab('results');
    setVisitedTabs(prev => new Set(prev).add('results'));
    setIsLoading(true);
    setError(null);
    setTaxBreakdown(null);

    try {
      const situation = {
        filingStatus,
        age: Number(age),
        spouseAge: spouseAge ? Number(spouseAge) : undefined
      };
      const result = await calculateTaxesFromGemini(situation, income, deductions, credits);
      setTaxBreakdown(result);
    } catch (err) {
      console.error(err);
      setError("Sorry, there was an error calculating your taxes. The AI model may be temporarily unavailable or the inputs provided could not be processed. Please check your inputs and try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setActiveTab('situation');
    setVisitedTabs(new Set(['situation']));
    setFilingStatus('single');
    setAge('');
    setSpouseAge('');
    setIncome(INITIAL_INCOME_STATE);
    setDeductions(INITIAL_DEDUCTIONS_STATE);
    setCredits(INITIAL_CREDITS_STATE);
    setTaxBreakdown(null);
    setError(null);
  };
  
  const renderActiveStep = () => {
    switch(activeTab) {
      case 'situation':
        return <StepSituation filingStatus={filingStatus} setFilingStatus={setFilingStatus} age={age} setAge={setAge} spouseAge={spouseAge} setSpouseAge={setSpouseAge} />;
      case 'income':
        return <StepIncome income={income} onIncomeChange={handleIncomeChange} />;
      case 'deductions':
        return <StepDeductions deductions={deductions} onDeductionChange={handleDeductionChange} />;
      case 'credits':
        return <StepCredits credits={credits} onCreditChange={handleCreditChange} />;
      case 'results':
        return <StepResults data={taxBreakdown} error={error} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8 flex items-start justify-center">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
          <TabNavigation activeTab={activeTab} navigateTo={navigateTo} visitedTabs={visitedTabs} />
          <div className="p-6 md:p-10 min-h-[400px]">
            {renderActiveStep()}
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <button
                onClick={handlePrevious}
                disabled={activeTab === 'situation'}
                className="px-6 py-2 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
                Previous
            </button>
            <div className="flex gap-4">
              <button onClick={handleReset} className="px-6 py-2 text-base font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
                  Reset
              </button>
              {activeTab !== 'results' ? (
                 activeTab === 'credits' ? (
                   <button
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="px-6 py-2 text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 flex items-center gap-2 disabled:bg-green-400"
                  >
                    <Icon icon="calculator" className="h-5 w-5"/>
                    Calculate
                  </button>
                 ) : (
                  <button onClick={handleNext} className="px-6 py-2 text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Next
                  </button>
                 )
              ) : (
                <button
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="px-6 py-2 text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 flex items-center gap-2 disabled:bg-green-400"
                  >
                     {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Recalculating...
                      </>
                    ) : 'Recalculate'}
                  </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;