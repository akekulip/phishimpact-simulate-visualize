
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, Mail, UserX, TrendingDown, AlertCircle, 
  Network, Lock, Database, Clock, DollarSign
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BusinessProfile } from "@/types/businessTypes";
import { SimulationParameters, SimulationResults, IncidenceStep } from "@/types/simulationTypes";
import { calculateImpactAtVariousIncidences, formatCurrency, formatPercentage } from "@/utils/simulationUtils";

interface ImpactDashboardProps {
  businessProfile: BusinessProfile;
  simulationParams: SimulationParameters;
  results: SimulationResults;
}

const RiskBadge = ({ level }: { level: "low" | "medium" | "high" | "critical" }) => {
  const colors = {
    low: "bg-risk-low",
    medium: "bg-risk-medium",
    high: "bg-risk-high",
    critical: "bg-risk-critical animate-pulse-danger"
  };
  
  const textColors = {
    low: "text-white",
    medium: "text-white",
    high: "text-white",
    critical: "text-white font-bold"
  };
  
  return (
    <span className={`${colors[level]} ${textColors[level]} px-2 py-1 rounded text-xs uppercase`}>
      {level}
    </span>
  );
};

const ImpactDashboard = ({ 
  businessProfile, 
  simulationParams, 
  results 
}: ImpactDashboardProps) => {
  const [incidenceData, setIncidenceData] = useState<IncidenceStep[]>([]);
  
  useEffect(() => {
    // Calculate impact at various incidence levels
    const data = calculateImpactAtVariousIncidences(businessProfile, simulationParams);
    setIncidenceData(data);
  }, [businessProfile, simulationParams]);
  
  const { 
    compromisedAccounts, 
    financialImpact, 
    operationalImpact, 
    riskLevels 
  } = results;
  
  // Prepare data for financial impact chart
  const financialChartData = [
    { name: "Remediation", value: financialImpact.remediationCosts },
    { name: "Productivity", value: financialImpact.productivityCosts },
    { name: "Revenue Loss", value: financialImpact.revenueLoss },
    { name: "Reputation", value: financialImpact.reputationCosts },
    { name: "Regulatory", value: financialImpact.regulatoryFines }
  ];
  
  // Prepare data for the incidence charts
  const incidenceChartData = incidenceData.map(item => ({
    incidence: formatPercentage(item.phishingRate),
    financialImpact: item.results.financialImpact.totalFinancialImpact,
    compromisedAccounts: item.results.compromisedAccounts,
    riskLevel: item.results.riskLevels.overall
  }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Simulation Summary</CardTitle>
            <CardDescription>Based on your business profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Employees Affected</div>
                <div className="flex items-center space-x-2">
                  <UserX className="h-5 w-5 text-phishing-600" />
                  <div className="text-2xl font-bold">{compromisedAccounts}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Financial Impact</div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-phishing-600" />
                  <div className="text-2xl font-bold">
                    {formatCurrency(financialImpact.totalFinancialImpact)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Recovery Time</div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-phishing-600" />
                  <div className="text-2xl font-bold">
                    {operationalImpact.recoveryTime.toFixed(1)} days
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-500">Overall Risk</div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-phishing-600" />
                  <div>
                    <RiskBadge level={riskLevels.overall} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Alert className={`
                ${riskLevels.overall === "low" ? "bg-risk-low/10 text-risk-low" : ""}
                ${riskLevels.overall === "medium" ? "bg-risk-medium/10 text-risk-medium" : ""}
                ${riskLevels.overall === "high" ? "bg-risk-high/10 text-risk-high" : ""}
                ${riskLevels.overall === "critical" ? "bg-risk-critical/10 text-risk-critical" : ""}
              `}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Risk Assessment</AlertTitle>
                <AlertDescription>
                  Based on your inputs, your business has a {riskLevels.overall} risk 
                  from phishing attacks with potential financial impact of {formatCurrency(financialImpact.totalFinancialImpact)}.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Risk Breakdown</CardTitle>
            <CardDescription>Impact categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Financial</div>
                    <RiskBadge level={riskLevels.financial} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(financialImpact.totalFinancialImpact / businessProfile.annualRevenue)} of annual revenue
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Operational</div>
                    <RiskBadge level={riskLevels.operational} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(operationalImpact.productivityLoss / 100)} productivity loss
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Reputational</div>
                    <RiskBadge level={riskLevels.reputational} />
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(financialImpact.reputationCosts)} potential brand damage
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Systems Affected</div>
                    <div className="font-medium">{operationalImpact.affectedSystems} of {businessProfile.criticalSystemsCount}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {operationalImpact.systemsDowntime.toFixed(1)} hours of downtime
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-medium mb-2">Financial Impact Breakdown:</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={financialChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value as number)}`, "Amount"]}
                      labelStyle={{ color: "#374151" }}
                    />
                    <Bar dataKey="value" fill="#38bdf8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Impact at Various Incidence Levels</CardTitle>
          <CardDescription>
            How different phishing rates affect your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial">
            <TabsList className="mb-4">
              <TabsTrigger value="financial">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial Impact
              </TabsTrigger>
              <TabsTrigger value="accounts">
                <UserX className="h-4 w-4 mr-2" />
                Compromised Accounts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={incidenceChartData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="incidence" 
                      label={{ 
                        value: "Phishing Incidence Rate", 
                        position: "bottom", 
                        offset: 20
                      }} 
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value / 1000}k`}
                      label={{ 
                        value: "Financial Impact", 
                        angle: -90, 
                        position: "insideLeft",
                        offset: -10
                      }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${formatCurrency(value as number)}`, "Financial Impact"]}
                      labelFormatter={(value) => `Phishing Rate: ${value}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="financialImpact" 
                      stroke="#0ea5e9" 
                      fill="#38bdf8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="accounts">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={incidenceChartData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="incidence" 
                      label={{ 
                        value: "Phishing Incidence Rate", 
                        position: "bottom", 
                        offset: 20
                      }} 
                    />
                    <YAxis 
                      label={{ 
                        value: "Compromised Accounts", 
                        angle: -90, 
                        position: "insideLeft",
                        offset: -10
                      }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} accounts`, "Compromised"]}
                      labelFormatter={(value) => `Phishing Rate: ${value}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="compromisedAccounts" 
                      stroke="#0ea5e9" 
                      strokeWidth={2}
                      dot={{ fill: "#0ea5e9", r: 4 }}
                      activeDot={{ r: 6, fill: "#0284c7" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactDashboard;
