import { GoogleGenAI, Type } from "@google/genai";
import type { TaxData, DeductionsData, IncomeData, CreditData, SituationData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    totalIncome: { type: Type.NUMBER },
    totalAboveTheLineDeductions: { type: Type.NUMBER },
    adjustedGrossIncome: { type: Type.NUMBER },
    standardDeduction: { type: Type.NUMBER },
    taxableIncome: { type: Type.NUMBER },
    initialFederalTax: { type: Type.NUMBER, description: "Total tax calculated on taxable income BEFORE any credits are applied." },
    totalNonrefundableCredits: { type: Type.NUMBER, description: "Sum of all nonrefundable credits applied. Cannot exceed initialFederalTax." },
    taxAfterNonrefundableCredits: { type: Type.NUMBER, description: "Tax liability after nonrefundable credits. Can't be less than 0." },
    totalRefundableCredits: { type: Type.NUMBER, description: "Sum of all refundable credits applied." },
    finalTaxOrRefund: { type: Type.NUMBER, description: "The final amount. Positive for tax due, negative for a refund." },
    taxableOrdinaryIncome: { type: Type.NUMBER },
    taxablePreferentialIncome: { type: Type.NUMBER },
    taxOnOrdinaryIncome: { type: Type.NUMBER },
    taxOnPreferentialIncome: { type: Type.NUMBER },
    effectiveTaxRate: { type: Type.NUMBER },
    taxBrackets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rate: { type: Type.NUMBER },
          incomeInBracket: { type: Type.NUMBER },
          taxOnIncome: { type: Type.NUMBER },
        },
        required: ["rate", "incomeInBracket", "taxOnIncome"],
      },
    },
    incomeTaxDetails: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sourceName: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          estimatedTax: { type: Type.NUMBER },
          taxType: { type: Type.STRING },
        },
        required: ["sourceName", "amount", "estimatedTax", "taxType"],
      },
    },
  },
  required: [
    'totalIncome', 
    'totalAboveTheLineDeductions', 
    'adjustedGrossIncome', 
    'standardDeduction', 
    'taxableIncome',
    'initialFederalTax',
    'totalNonrefundableCredits',
    'taxAfterNonrefundableCredits',
    'totalRefundableCredits',
    'finalTaxOrRefund',
    'taxableOrdinaryIncome',
    'taxablePreferentialIncome',
    'taxOnOrdinaryIncome',
    'taxOnPreferentialIncome',
    'effectiveTaxRate',
    'taxBrackets',
    'incomeTaxDetails'
  ],
};

export const calculateTaxesFromGemini = async (situation: SituationData, income: IncomeData, deductions: DeductionsData, credits: CreditData): Promise<TaxData> => {
  const situationText = JSON.stringify(situation);
  const incomeText = JSON.stringify(income);
  const deductionsText = JSON.stringify(deductions);
  const creditsText = JSON.stringify(credits);

  const prompt = `
    You are an expert tax calculation AI for the USA 2024 tax year.
    Given the user's financial details, perform a detailed federal income tax calculation.

    User's Data:
    - Situation: ${situationText}
    - Income sources: ${incomeText}
    - Above-the-Line Deductions: ${deductionsText}
    - Tax Credits: ${creditsText}

    Follow these calculation steps precisely using 2024 IRS rules:
    1.  **Gross Income (totalIncome)**: Calculate by summing all values from the income sources object.
    2.  **Total Above-the-Line Deductions**: Sum all values from the deductions object.
    3.  **Adjusted Gross Income (AGI)**: Calculate as Gross Income minus Total Above-the-Line Deductions.
    4.  **Standard Deduction**: Determine the correct 2024 Standard Deduction for the user's filing status and age(s). Individuals 65 or older get an additional standard deduction amount.
    5.  **Taxable Income**: Calculate as AGI minus the Standard Deduction. If this is less than zero, it's 0.
    6.  **Separate Income Types**: From Taxable Income, separate it into 'taxablePreferentialIncome' (Long-Term Capital Gains + Qualified Dividends, capped at Taxable Income) and 'taxableOrdinaryIncome' (the remainder).
    7.  **Calculate Initial Tax (initialFederalTax)**: Calculate the tax on ordinary income ('taxOnOrdinaryIncome') and preferential income ('taxOnPreferentialIncome') separately using the correct 2024 brackets. Sum them to get 'initialFederalTax'. Provide the ordinary income tax bracket breakdown in 'taxBrackets'.
    8.  **Apply Nonrefundable Credits**: Calculate 'totalNonrefundableCredits' by summing the applicable nonrefundable credit values from the user's input. The value of these credits cannot exceed 'initialFederalTax'. Calculate 'taxAfterNonrefundableCredits' which is 'initialFederalTax' minus 'totalNonrefundableCredits' (cannot be below $0).
    9.  **Apply Refundable Credits**: Calculate 'totalRefundableCredits' by summing the applicable refundable credit values.
    10. **Final Calculation**: Calculate 'finalTaxOrRefund' as 'taxAfterNonrefundableCredits' minus 'totalRefundableCredits'. A positive number means tax is due; a negative number means a refund is due.
    11. **Effective Tax Rate**: Calculate as (finalTaxOrRefund / totalIncome) * 100. If tax is due, use the positive value for the calculation. If it's a refund, the rate can be considered 0 or negative, but for simplicity, let's show it as the final tax divided by income. If income is zero, rate is zero.
    12. **Allocate Tax by Source (incomeTaxDetails)**: Allocate the 'initialFederalTax' (before credits) back to the original non-zero income sources to show where the tax burden originates. The sum of 'estimatedTax' across all items MUST equal the 'initialFederalTax'.

    Provide the output in a clean JSON format matching the requested schema. Do not add any introductory text, explanations, or markdown formatting outside of the JSON structure.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith("{") || !jsonText.endsWith("}")) {
        throw new Error("Invalid JSON response from AI. The response was not a JSON object.");
    }
    const parsedData = JSON.parse(jsonText);

    if (!parsedData || typeof parsedData.finalTaxOrRefund === 'undefined') {
        throw new Error("AI response is missing required fields.");
    }
    
    return parsedData as TaxData;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    throw new Error("Failed to get tax calculation from AI service.");
  }
};