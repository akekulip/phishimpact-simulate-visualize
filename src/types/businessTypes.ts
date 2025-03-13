
export interface BusinessProfile {
  companyName: string;
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  dataImportance: number; // Scale 1-10
  techMaturity: number; // Scale 1-10
  averageSalary: number;
  criticalSystemsCount: number;
}

export interface IndustryRiskFactor {
  industry: string;
  riskMultiplier: number;
}

export const industryRiskFactors: IndustryRiskFactor[] = [
  { industry: "Healthcare", riskMultiplier: 1.5 },
  { industry: "Finance", riskMultiplier: 1.8 },
  { industry: "Technology", riskMultiplier: 1.3 },
  { industry: "Retail", riskMultiplier: 1.2 },
  { industry: "Manufacturing", riskMultiplier: 1.0 },
  { industry: "Education", riskMultiplier: 1.4 },
  { industry: "Government", riskMultiplier: 1.6 },
  { industry: "Nonprofit", riskMultiplier: 1.1 },
  { industry: "Other", riskMultiplier: 1.0 }
];
