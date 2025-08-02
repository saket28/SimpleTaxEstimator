export type IncomeCategoryKey = 
  'wages' | 
  'tips' | 
  'selfEmployment' | 
  'interest' | 
  'ordinaryDividends' |
  'qualifiedDividends' |
  'shortTermCapitalGains' |
  'longTermCapitalGains' |
  'annuitiesReits' | 
  'retirementDistributions' | 
  'socialSecurity' | 
  'unemployment' | 
  'rentalRoyalties' | 
  'other';

export type IncomeData = Record<string, number>;

export type DeductionCategoryKey = 
  'educatorExpenses' |
  'studentLoanInterest' |
  'hsaContributions' |
  'iraContribution' |
  'selfEmploymentTax' |
  'sepSimpleSolo401k' |
  'alimonyPaid' |
  'movingExpensesMilitary' |
  'earlyWithdrawalPenalty' |
  'scheduleCExpenses';

export type DeductionsData = Record<DeductionCategoryKey, number>;

export type CreditCategoryKey =
  'eitc' |
  'childTaxCreditRefundable' |
  'americanOpportunityCreditRefundable' |
  'premiumTaxCredit' |
  'recoveryRebateCredit' |
  'childTaxCreditNonrefundable' |
  'otherDependentsCredit' |
  'saversCredit' |
  'lifetimeLearningCredit' |
  'americanOpportunityCreditNonrefundable' |
  'foreignTaxCredit' |
  'adoptionCredit' |
  'residentialEnergyCredit' |
  'evTaxCredit' |
  'elderlyDisabledCredit' |
  'electricMotorcycleCredit' |
  'childcareCredit';

export type CreditData = Record<CreditCategoryKey, number>;

export type FilingStatus = 'single' | 'marriedFilingJointly' | 'marriedFilingSeparately' | 'headOfHousehold';

export interface TaxBracketDetail {
  rate: number;
  incomeInBracket: number;
  taxOnIncome: number;
}

export interface IncomeTaxDetail {
  sourceName: string;
  amount: number;
  estimatedTax: number;
  taxType: string;
}

export interface TaxData {
  // Calculation Flow
  totalIncome: number;
  totalAboveTheLineDeductions: number;
  adjustedGrossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  
  // Tax Calculation
  initialFederalTax: number;
  totalNonrefundableCredits: number;
  taxAfterNonrefundableCredits: number;
  totalRefundableCredits: number;
  finalTaxOrRefund: number; // Final liability. Negative value means a refund.

  // Breakdowns
  taxableOrdinaryIncome: number;
  taxablePreferentialIncome: number;
  taxOnOrdinaryIncome: number;
  taxOnPreferentialIncome: number;
  effectiveTaxRate: number;
  taxBrackets: TaxBracketDetail[];
  incomeTaxDetails: IncomeTaxDetail[];
}

export interface SituationData {
    filingStatus: FilingStatus;
    age: number;
    spouseAge?: number;
}