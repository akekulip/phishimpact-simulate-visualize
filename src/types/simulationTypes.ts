
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

// FDNA Network Types
export interface NetworkNode {
  id: string;
  name: string;
  type: "feeder" | "receiver"; // Feeder initiates, receiver gets impacted
  category: "confidentiality" | "integrity" | "availability"; // CIA triad categories
  importance: number; // 0-10 scale of node importance
  vulnerabilityLevel: number; // 0-1 scale of vulnerability
  impactLevel: number; // 0-1 calculated impact level
}

export interface NetworkEdge {
  source: string; // Source node ID
  target: string; // Target node ID
  dependencyStrength: number; // 0-1 how strong is the dependency
  category: "c-to-c" | "c-to-i" | "c-to-a" | "i-to-c" | "i-to-i" | "i-to-a" | "a-to-c" | "a-to-i" | "a-to-a"; // Connection types between CIA categories
}

export interface CascadeResults {
  nodes: NetworkNode[];
  cascadeLevels: NetworkNodeImpact[][];
}

export interface NetworkNodeImpact {
  nodeId: string;
  impactLevel: number;
  cascadeStep: number;
}
