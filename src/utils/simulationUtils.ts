
import { BusinessProfile, industryRiskFactors } from "@/types/businessTypes";
import { SimulationParameters, SimulationResults, FinancialImpact, OperationalImpact, RiskLevels, IncidenceStep } from "@/types/simulationTypes";

// Calculate the number of compromised accounts based on simulation parameters
const calculateCompromisedAccounts = (
  employeeCount: number,
  params: SimulationParameters
): number => {
  return Math.round(
    employeeCount * 
    params.phishingRate * 
    params.clickThroughRate * 
    params.compromiseRate
  );
};

// Calculate financial impact based on compromised accounts and business profile
const calculateFinancialImpact = (
  compromisedAccounts: number,
  businessProfile: BusinessProfile,
  industryRiskMultiplier: number
): FinancialImpact => {
  const { annualRevenue, employeeCount, averageSalary, dataImportance, criticalSystemsCount } = businessProfile;
  
  // Base costs per compromised account
  const baseCostPerCompromise = 3000;
  
  // Remediation costs: IT labor, security tools, etc.
  const remediationCosts = compromisedAccounts * baseCostPerCompromise * (1 + dataImportance / 10);
  
  // Productivity costs: employee downtime, IT staff time
  const workingDaysPerYear = 240;
  const dailyProductivityCost = (averageSalary / workingDaysPerYear);
  const avgDowntimeDays = Math.min(3 + (compromisedAccounts / employeeCount) * 10, 14);
  const productivityCosts = compromisedAccounts * dailyProductivityCost * avgDowntimeDays;
  
  // Revenue loss: direct business impact
  const revenueLossPercentage = Math.min(
    (compromisedAccounts / employeeCount) * (criticalSystemsCount / 10) * industryRiskMultiplier * 0.05,
    0.15 // Cap at 15%
  );
  const revenueLoss = annualRevenue * revenueLossPercentage;
  
  // Reputation costs: customer loss, brand damage
  const reputationMultiplier = dataImportance / 10 * industryRiskMultiplier;
  const reputationCosts = annualRevenue * 0.01 * reputationMultiplier * Math.min(compromisedAccounts / 5, 1);
  
  // Regulatory fines
  const regulatoryFines = dataImportance > 7 ? 
    (compromisedAccounts * 500 * industryRiskMultiplier) : 0;
  
  // Calculate total impact
  const directCostsTotal = remediationCosts + productivityCosts;
  const totalFinancialImpact = directCostsTotal + revenueLoss + reputationCosts + regulatoryFines;
  
  return {
    directCostsTotal,
    remediationCosts,
    productivityCosts,
    revenueLoss,
    reputationCosts,
    regulatoryFines,
    totalFinancialImpact
  };
};

// Calculate operational impact
const calculateOperationalImpact = (
  compromisedAccounts: number,
  businessProfile: BusinessProfile
): OperationalImpact => {
  const { employeeCount, techMaturity, criticalSystemsCount } = businessProfile;
  
  // Calculate percentage of organization compromised
  const compromisedPercentage = compromisedAccounts / employeeCount;
  
  // Systems downtime increases with compromised percentage and critical systems
  // but decreases with tech maturity
  const baseDowntime = 4; // Base hours
  const systemsDowntime = baseDowntime * 
    (1 + compromisedPercentage * criticalSystemsCount) * 
    (1 - techMaturity / 20); // Tech maturity reduces impact
  
  // Productivity loss
  const productivityLoss = Math.min(compromisedPercentage * 100 * (criticalSystemsCount / 5), 90);
  
  // Recovery time in days
  const baseRecoveryTime = 1; // Base days
  const recoveryTime = baseRecoveryTime * 
    (1 + compromisedPercentage * 10) * 
    (1 - techMaturity / 20);
  
  // Number of affected systems
  const affectedSystems = Math.ceil(criticalSystemsCount * compromisedPercentage * 1.5);
  
  return {
    systemsDowntime,
    productivityLoss,
    recoveryTime,
    affectedSystems
  };
};

// Determine risk levels based on impacts
const calculateRiskLevels = (
  financialImpact: FinancialImpact,
  operationalImpact: OperationalImpact,
  businessProfile: BusinessProfile
): RiskLevels => {
  const { annualRevenue } = businessProfile;
  
  // Financial risk level
  let financial: "low" | "medium" | "high" | "critical";
  const financialImpactRatio = financialImpact.totalFinancialImpact / annualRevenue;
  
  if (financialImpactRatio < 0.01) {
    financial = "low";
  } else if (financialImpactRatio < 0.05) {
    financial = "medium";
  } else if (financialImpactRatio < 0.15) {
    financial = "high";
  } else {
    financial = "critical";
  }
  
  // Operational risk level
  let operational: "low" | "medium" | "high" | "critical";
  
  if (operationalImpact.recoveryTime < 2 && operationalImpact.productivityLoss < 20) {
    operational = "low";
  } else if (operationalImpact.recoveryTime < 5 && operationalImpact.productivityLoss < 40) {
    operational = "medium";
  } else if (operationalImpact.recoveryTime < 10 && operationalImpact.productivityLoss < 70) {
    operational = "high";
  } else {
    operational = "critical";
  }
  
  // Reputational risk level
  let reputational: "low" | "medium" | "high" | "critical";
  const reputationalImpactRatio = financialImpact.reputationCosts / annualRevenue;
  
  if (reputationalImpactRatio < 0.005) {
    reputational = "low";
  } else if (reputationalImpactRatio < 0.02) {
    reputational = "medium";
  } else if (reputationalImpactRatio < 0.05) {
    reputational = "high";
  } else {
    reputational = "critical";
  }
  
  // Overall risk
  const riskScores = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  };
  
  const averageRiskScore = (
    riskScores[financial] + 
    riskScores[operational] + 
    riskScores[reputational]
  ) / 3;
  
  let overall: "low" | "medium" | "high" | "critical";
  
  if (averageRiskScore < 1.5) {
    overall = "low";
  } else if (averageRiskScore < 2.5) {
    overall = "medium";
  } else if (averageRiskScore < 3.5) {
    overall = "high";
  } else {
    overall = "critical";
  }
  
  return {
    financial,
    operational,
    reputational,
    overall
  };
};

// Main function to calculate phishing impact
export const calculatePhishingImpact = (
  businessProfile: BusinessProfile,
  params: SimulationParameters
): SimulationResults => {
  // Get industry risk multiplier
  const industryRisk = industryRiskFactors.find(
    (factor) => factor.industry === businessProfile.industry
  ) || { industry: "Other", riskMultiplier: 1.0 };
  
  // Calculate number of compromised accounts
  const compromisedAccounts = calculateCompromisedAccounts(
    businessProfile.employeeCount,
    params
  );
  
  // Calculate financial impact
  const financialImpact = calculateFinancialImpact(
    compromisedAccounts,
    businessProfile,
    industryRisk.riskMultiplier
  );
  
  // Calculate operational impact
  const operationalImpact = calculateOperationalImpact(
    compromisedAccounts,
    businessProfile
  );
  
  // Calculate risk levels
  const riskLevels = calculateRiskLevels(
    financialImpact,
    operationalImpact,
    businessProfile
  );
  
  return {
    compromisedAccounts,
    financialImpact,
    operationalImpact,
    riskLevels
  };
};

// Calculate impact at various incidence levels
export const calculateImpactAtVariousIncidences = (
  businessProfile: BusinessProfile,
  baseParams: SimulationParameters,
  steps: number = 5
): IncidenceStep[] => {
  const results: IncidenceStep[] = [];
  const maxPhishingRate = 0.5; // 50% max phishing rate
  
  for (let i = 0; i <= steps; i++) {
    const phishingRate = (i / steps) * maxPhishingRate;
    const params = { ...baseParams, phishingRate };
    const stepResults = calculatePhishingImpact(businessProfile, params);
    
    results.push({
      phishingRate,
      results: stepResults
    });
  }
  
  return results;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1
  }).format(value);
};
