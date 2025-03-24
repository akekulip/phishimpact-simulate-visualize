
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import BusinessProfileForm from "@/components/BusinessProfileForm";
import PhishingSimulator from "@/components/PhishingSimulator";
import ImpactDashboard from "@/components/ImpactDashboard";
import DependencyNetworkSimulation from "@/components/DependencyNetworkSimulation";
import FDNACyberGraph from "@/components/FDNACyberGraph";
import { BusinessProfile } from "@/types/businessTypes";
import { SimulationResults } from "@/types/simulationTypes";
import { calculatePhishingImpact } from "@/utils/simulationUtils";
import { Info } from "lucide-react";

const Index = () => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [simulationParams, setSimulationParams] = useState({
    phishingRate: 0.2,
    clickThroughRate: 0.3,
    compromiseRate: 0.5,
  });
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  const handleProfileSubmit = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    
    if (profile) {
      const results = calculatePhishingImpact(profile, simulationParams);
      setSimulationResults(results);
    }
  };

  const handleSimulationUpdate = (params: {
    phishingRate: number;
    clickThroughRate: number;
    compromiseRate: number;
  }) => {
    setSimulationParams(params);
    
    if (businessProfile) {
      const results = calculatePhishingImpact(businessProfile, params);
      setSimulationResults(results);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                PhishImpact: Simulate and Visualize Phishing Risk
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Model the potential impact of phishing attacks on your small business
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Link 
                to="/about" 
                className="flex items-center text-phishing-600 hover:text-phishing-800 transition-colors"
              >
                <Info className="h-4 w-4 mr-1" />
                <span>About the calculations</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                A CCR Cyber Cascade Risk Lab Project
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-8">
              <BusinessProfileForm onSubmit={handleProfileSubmit} />
            </div>
            <div>
              {businessProfile && (
                <PhishingSimulator 
                  initialParams={simulationParams}
                  onUpdate={handleSimulationUpdate}
                />
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {simulationResults ? (
              <div className="space-y-8">
                <ImpactDashboard 
                  businessProfile={businessProfile!}
                  simulationParams={simulationParams}
                  results={simulationResults}
                />
                
                <FDNACyberGraph 
                  businessProfile={businessProfile!}
                  compromisedAccounts={simulationResults.compromisedAccounts}
                />
                
                <DependencyNetworkSimulation 
                  businessProfile={businessProfile!}
                  compromisedAccounts={simulationResults.compromisedAccounts}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                <div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No data to display</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter your business profile details to start simulating phishing impacts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
