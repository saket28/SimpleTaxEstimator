import type { IncomeData, FilingStatus, DeductionCategoryKey, DeductionsData, CreditData, CreditCategoryKey } from './types';
import type { IconType } from './components/Icon';

// --- SHARED INTERFACES ---
interface Option {
  key: string;
  label: string;
  icon: IconType;
  description?: string;
}

interface Group {
  title: string;
  description: string;
  items: Option[];
}


// --- FILING STATUS ---
interface FilingStatusOption {
  key: FilingStatus;
  label: string;
}
export const FILING_STATUSES: FilingStatusOption[] = [
  { key: 'single', label: 'Single' },
  { key: 'marriedFilingJointly', label: 'Married Filing Jointly' },
  { key: 'marriedFilingSeparately', label: 'Married Filing Separately' },
  { key: 'headOfHousehold', label: 'Head of Household' },
];

// --- INCOME ---
interface IncomeSource extends Option {
  taxType: 'Ordinary' | 'Preferential';
}
interface IncomeGroup {
  title: string;
  description: string;
  sources: IncomeSource[];
}
export const INCOME_GROUPS: IncomeGroup[] = [
  {
    title: 'Earned Income',
    description: 'Wages, salaries, tips, self-employment, gig work',
    sources: [
      { key: 'wages', label: 'Wages, Salaries', icon: 'briefcase', taxType: 'Ordinary' },
      { key: 'tips', label: 'Tips', icon: 'handshake', taxType: 'Ordinary' },
      { key: 'selfEmployment', label: 'Self-Employment, Gig Work', icon: 'circle-dollar', taxType: 'Ordinary' },
    ]
  },
  {
    title: 'Investment Income',
    description: 'Interest, dividends, and capital gains.',
    sources: [
      { key: 'interest', label: 'Interest', icon: 'percent', taxType: 'Ordinary' },
      { key: 'ordinaryDividends', label: 'Ordinary Dividends', icon: 'chart-pie', taxType: 'Ordinary' },
      { key: 'qualifiedDividends', label: 'Qualified Dividends', icon: 'chart-pie', taxType: 'Preferential' },
      { key: 'shortTermCapitalGains', label: 'Short-Term Capital Gains', icon: 'arrow-trend-up', taxType: 'Ordinary' },
      { key: 'longTermCapitalGains', label: 'Long-Term Capital Gains', icon: 'arrow-trend-up', taxType: 'Preferential' },
      { key: 'annuitiesReits', label: 'Annuities & REITs', icon: 'building-columns', taxType: 'Ordinary' },
    ]
  },
  {
    title: 'Retirement & Government Income',
    description: 'IRA, pensions, social security, unemployment',
    sources: [
      { key: 'retirementDistributions', label: 'IRA, 401k, Pensions', icon: 'piggy-bank', taxType: 'Ordinary' },
      { key: 'socialSecurity', label: 'Social Security Benefits', icon: 'landmark', taxType: 'Ordinary' },
      { key: 'unemployment', label: 'Unemployment Benefits', icon: 'briefcase', taxType: 'Ordinary' },
    ]
  },
  {
    title: 'Passive & Miscellaneous Income',
    description: 'Rental, royalties, gambling, crypto, etc.',
    sources: [
      { key: 'rentalRoyalties', label: 'Rental & Royalties', icon: 'building-columns', taxType: 'Ordinary' },
      { key: 'other', label: 'Other Miscellaneous Income', icon: 'circle-dollar', taxType: 'Ordinary' }
    ]
  }
];

// --- DEDUCTIONS ---
export const DEDUCTION_GROUPS: Group[] = [
    {
        title: 'Common Deductions',
        description: 'These reduce your Adjusted Gross Income (AGI).',
        items: [
            { key: 'iraContribution', label: 'Traditional IRA Contributions', icon: 'piggy-bank' },
            { key: 'studentLoanInterest', label: 'Student Loan Interest', icon: 'graduation-cap' },
            { key: 'hsaContributions', label: 'HSA Contributions', icon: 'heart-pulse' },
            { key: 'educatorExpenses', label: 'Educator Expenses', icon: 'user-graduate' },
        ]
    },
    {
        title: 'Self-Employed & Business',
        description: 'Deductions for business owners and freelancers.',
        items: [
            { key: 'selfEmploymentTax', label: '50% of Self-Employment Tax', icon: 'briefcase' },
            { key: 'sepSimpleSolo401k', label: 'SEP/SIMPLE/Solo 401(k)', icon: 'landmark' },
            { key: 'scheduleCExpenses', label: 'Schedule C Expenses', icon: 'clipboard' },
        ]
    },
    {
        title: 'Other Deductions',
        description: 'Less common deductions for specific situations.',
        items: [
            { key: 'alimonyPaid', label: 'Alimony Paid (pre-2019)', icon: 'file-invoice-dollar' },
            { key: 'movingExpensesMilitary', label: 'Moving (Military only)', icon: 'truck' },
            { key: 'earlyWithdrawalPenalty', label: 'Penalty on Early CD Withdrawal', icon: 'banknotes' },
        ]
    }
];

// --- CREDITS ---
export const CREDIT_GROUPS: { refundable: Group, nonrefundable: Group } = {
  refundable: {
    title: 'Refundable Credits',
    description: 'These can give you a refund even if you owe no tax.',
    items: [
      { key: 'eitc', label: 'Earned Income Tax Credit (EITC)', icon: 'hand-holding-dollar' },
      { key: 'childTaxCreditRefundable', label: 'Child Tax Credit (Refundable Part)', icon: 'baby' },
      { key: 'americanOpportunityCreditRefundable', label: 'American Opportunity Credit (40%)', icon: 'user-graduate' },
      { key: 'premiumTaxCredit', label: 'Premium Tax Credit (ACA)', icon: 'heart-pulse' },
      { key: 'recoveryRebateCredit', label: 'Recovery Rebate Credit (Past Stimulus)', icon: 'circle-dollar' },
    ]
  },
  nonrefundable: {
    title: 'Nonrefundable Credits',
    description: 'These can reduce your tax to $0, but you don\'t get any of it back as a refund.',
    items: [
      { key: 'childTaxCreditNonrefundable', label: 'Child Tax Credit (Nonrefundable Part)', icon: 'baby' },
      { key: 'otherDependentsCredit', label: 'Credit for Other Dependents', icon: 'users' },
      { key: 'saversCredit', label: 'Retirement Savings (Saver\'s Credit)', icon: 'piggy-bank' },
      { key: 'lifetimeLearningCredit', label: 'Lifetime Learning Credit', icon: 'user-graduate' },
      { key: 'americanOpportunityCreditNonrefundable', label: 'American Opportunity Credit (60%)', icon: 'user-graduate' },
      { key: 'foreignTaxCredit', label: 'Foreign Tax Credit', icon: 'globe' },
      { key: 'adoptionCredit', label: 'Adoption Credit', icon: 'baby' },
      { key: 'residentialEnergyCredit', label: 'Residential Energy Credits', icon: 'leaf' },
      { key: 'evTaxCredit', label: 'Clean Vehicle (EV) Tax Credit', icon: 'car' },
      { key: 'elderlyDisabledCredit', label: 'Elderly and Disabled Credit', icon: 'user-group' },
      { key: 'electricMotorcycleCredit', label: 'Plug-in Motorcycle Credit', icon: 'bolt' },
      { key: 'childcareCredit', label: 'Child/Dependent Care Credit', icon: 'baby' },
    ]
  }
};


// --- INITIAL STATES ---
const allIncomeKeys = INCOME_GROUPS.flatMap(group => group.sources.map(source => source.key));
export const INITIAL_INCOME_STATE: IncomeData = allIncomeKeys.reduce((acc, key) => {
    (acc as any)[key] = 0;
    return acc;
}, {} as IncomeData);

const allDeductionKeys = DEDUCTION_GROUPS.flatMap(group => group.items.map(item => item.key as DeductionCategoryKey));
export const INITIAL_DEDUCTIONS_STATE: DeductionsData = allDeductionKeys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
}, {} as DeductionsData);

const allCreditKeys = [...CREDIT_GROUPS.refundable.items, ...CREDIT_GROUPS.nonrefundable.items].map(item => item.key as CreditCategoryKey);
export const INITIAL_CREDITS_STATE: CreditData = allCreditKeys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
}, {} as CreditData);