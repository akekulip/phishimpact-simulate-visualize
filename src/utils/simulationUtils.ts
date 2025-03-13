import { BusinessProfile, industryRiskFactors } from "@/types/businessTypes";
import { 
  SimulationParameters, 
  SimulationResults, 
  FinancialImpact, 
  OperationalImpact, 
  RiskLevels, 
  IncidenceStep,
  NetworkNode,
  NetworkEdge,
  CascadeResults,
  NetworkNodeImpact
} from "@/types/simulationTypes";

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

// Generate default FDNA network based on business profile
export const generateDefaultNetwork = (businessProfile: BusinessProfile): { nodes: NetworkNode[], edges: NetworkEdge[] } => {
  const { criticalSystemsCount, dataImportance, techMaturity } = businessProfile;
  
  // Base vulnerability based on tech maturity (inverse relationship)
  const baseVulnerability = 1 - (techMaturity / 10);
  
  // Create nodes
  const nodes: NetworkNode[] = [
    // Feeder nodes (source of the attack/compromise)
    {
      id: "email",
      name: "Email System",
      type: "feeder",
      category: "confidentiality",
      importance: 8,
      vulnerabilityLevel: baseVulnerability * 1.2, // Email often more vulnerable
      impactLevel: 0 // Will be calculated during simulation
    },
    {
      id: "credentials",
      name: "User Credentials",
      type: "feeder",
      category: "confidentiality",
      importance: 9,
      vulnerabilityLevel: baseVulnerability * 1.1,
      impactLevel: 0
    },
    {
      id: "workstations",
      name: "Employee Workstations",
      type: "feeder",
      category: "integrity",
      importance: 7,
      vulnerabilityLevel: baseVulnerability * 1.3,
      impactLevel: 0
    },
    
    // Receiver nodes (impacted by the attack)
    {
      id: "customer_data",
      name: "Customer Data",
      type: "receiver",
      category: "confidentiality",
      importance: dataImportance,
      vulnerabilityLevel: baseVulnerability,
      impactLevel: 0
    },
    {
      id: "financial_systems",
      name: "Financial Systems",
      type: "receiver",
      category: "integrity",
      importance: 9,
      vulnerabilityLevel: baseVulnerability * 0.9, // Usually better protected
      impactLevel: 0
    },
    {
      id: "productivity_apps",
      name: "Productivity Apps",
      type: "receiver",
      category: "availability",
      importance: 6,
      vulnerabilityLevel: baseVulnerability,
      impactLevel: 0
    },
    {
      id: "communication",
      name: "Communication Systems",
      type: "receiver",
      category: "availability",
      importance: 8,
      vulnerabilityLevel: baseVulnerability,
      impactLevel: 0
    }
  ];
  
  // Add any additional critical systems based on criticalSystemsCount
  if (criticalSystemsCount > 5) {
    nodes.push({
      id: "crm",
      name: "CRM System",
      type: "receiver",
      category: "integrity",
      importance: 8,
      vulnerabilityLevel: baseVulnerability,
      impactLevel: 0
    });
  }
  
  if (criticalSystemsCount > 7) {
    nodes.push({
      id: "erp",
      name: "ERP System",
      type: "receiver",
      category: "integrity",
      importance: 9,
      vulnerabilityLevel: baseVulnerability * 0.8,
      impactLevel: 0
    });
  }
  
  // Create edges
  const edges: NetworkEdge[] = [
    // Email system connections
    {
      source: "email",
      target: "customer_data",
      dependencyStrength: 0.7,
      category: "c-to-c"
    },
    {
      source: "email",
      target: "communication",
      dependencyStrength: 0.9,
      category: "c-to-a"
    },
    
    // Credentials connections
    {
      source: "credentials",
      target: "financial_systems",
      dependencyStrength: 0.8,
      category: "c-to-i"
    },
    {
      source: "credentials",
      target: "customer_data",
      dependencyStrength: 0.9,
      category: "c-to-c"
    },
    
    // Workstation connections
    {
      source: "workstations",
      target: "productivity_apps",
      dependencyStrength: 0.8,
      category: "i-to-a"
    },
    {
      source: "workstations",
      target: "communication",
      dependencyStrength: 0.6,
      category: "i-to-a"
    }
  ];
  
  // Add conditional edges for additional systems
  if (criticalSystemsCount > 5) {
    edges.push(
      {
        source: "credentials",
        target: "crm",
        dependencyStrength: 0.7,
        category: "c-to-i"
      },
      {
        source: "workstations",
        target: "crm",
        dependencyStrength: 0.5,
        category: "i-to-i"
      }
    );
  }
  
  if (criticalSystemsCount > 7) {
    edges.push(
      {
        source: "credentials",
        target: "erp",
        dependencyStrength: 0.8,
        category: "c-to-i"
      },
      {
        source: "financial_systems",
        target: "erp",
        dependencyStrength: 0.7,
        category: "i-to-i"
      }
    );
  }
  
  return { nodes, edges };
};

// Calculate cascade impact through the network
export const calculateCascadeImpact = (
  businessProfile: BusinessProfile,
  compromisedAccounts: number,
  nodes: NetworkNode[],
  edges: NetworkEdge[]
): CascadeResults => {
  const { employeeCount } = businessProfile;
  
  // Calculate initial impact for feeder nodes based on compromised accounts
  const compromiseRatio = compromisedAccounts / employeeCount;
  let updatedNodes = [...nodes];
  
  // Set initial impact on feeder nodes
  updatedNodes = updatedNodes.map(node => {
    if (node.type === "feeder") {
      // Calculate impact based on compromised accounts and node vulnerability
      const initialImpact = Math.min(compromiseRatio * node.vulnerabilityLevel * 2, 1);
      return { ...node, impactLevel: initialImpact };
    }
    return node;
  });
  
  // Track cascade levels for visualization
  const cascadeLevels: NetworkNodeImpact[][] = [];
  const initialImpacts: NetworkNodeImpact[] = updatedNodes
    .filter(node => node.type === "feeder" && node.impactLevel > 0)
    .map(node => ({
      nodeId: node.id,
      impactLevel: node.impactLevel,
      cascadeStep: 0
    }));
  
  cascadeLevels.push(initialImpacts);
  
  // Propagate impact through the network for multiple steps
  const MAX_CASCADE_STEPS = 3;
  
  for (let step = 0; step < MAX_CASCADE_STEPS; step++) {
    const stepImpacts: NetworkNodeImpact[] = [];
    let impactInThisStep = false;
    
    // For each edge, propagate impact from source to target
    edges.forEach(edge => {
      const sourceNode = updatedNodes.find(n => n.id === edge.source);
      const targetNode = updatedNodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode && sourceNode.impactLevel > 0) {
        // Calculate propagated impact
        const propagatedImpact = sourceNode.impactLevel * 
                               edge.dependencyStrength * 
                               targetNode.vulnerabilityLevel;
        
        // Only update if the propagated impact is greater than current impact
        if (propagatedImpact > targetNode.impactLevel) {
          const newImpact = Math.min(propagatedImpact, 1);
          
          // Update the node
          updatedNodes = updatedNodes.map(n => 
            n.id === targetNode.id ? { ...n, impactLevel: newImpact } : n
          );
          
          // Record this impact for cascade visualization
          stepImpacts.push({
            nodeId: targetNode.id,
            impactLevel: newImpact,
            cascadeStep: step + 1
          });
          
          impactInThisStep = true;
        }
      }
    });
    
    if (stepImpacts.length > 0) {
      cascadeLevels.push(stepImpacts);
    }
    
    // If no impact propagated in this step, we're done
    if (!impactInThisStep) break;
  }
  
  return {
    nodes: updatedNodes,
    cascadeLevels
  };
};
