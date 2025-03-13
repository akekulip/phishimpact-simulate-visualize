
export interface SimulationParameters {
  phishingRate: number; // Percentage of employees who receive phishing emails
  clickThroughRate: number; // Percentage of recipients who click phishing links
  compromiseRate: number; // Percentage of clicks that result in compromise
}

export interface FinancialImpact {
  directCostsTotal: number;
  remediationCosts: number;
  productivityCosts: number;
  revenueLoss: number;
  reputationCosts: number;
  regulatoryFines: number;
  totalFinancialImpact: number;
}

export interface OperationalImpact {
  systemsDowntime: number; // In hours
  productivityLoss: number; // Percentage
  recoveryTime: number; // In days
  affectedSystems: number;
}

export interface RiskLevels {
  financial: "low" | "medium" | "high" | "critical";
  operational: "low" | "medium" | "high" | "critical";
  reputational: "low" | "medium" | "high" | "critical";
  overall: "low" | "medium" | "high" | "critical";
}

export interface SimulationResults {
  compromisedAccounts: number;
  financialImpact: FinancialImpact;
  operationalImpact: OperationalImpact;
  riskLevels: RiskLevels;
  mitigatedRisk?: RiskLevels;
}

export interface IncidenceStep {
  phishingRate: number;
  results: SimulationResults;
}
