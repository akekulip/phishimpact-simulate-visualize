
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { NetworkNode, NetworkEdge, CascadeResults } from "@/types/simulationTypes";
import { BusinessProfile } from "@/types/businessTypes";
import { generateDefaultNetwork, calculateCascadeImpact } from "@/utils/simulationUtils";
import { Shield, ArrowRight, LucideServer, Database, Key, Mail, Laptop, Users, LineChart } from "lucide-react";

interface DependencyNetworkSimulationProps {
  businessProfile: BusinessProfile;
  compromisedAccounts: number;
}

// Map category to color
const categoryColors = {
  confidentiality: "bg-blue-500",
  integrity: "bg-green-500",
  availability: "bg-purple-500",
};

// Map impact level to color
const getImpactColor = (level: number) => {
  if (level < 0.25) return "bg-risk-low";
  if (level < 0.5) return "bg-risk-medium";
  if (level < 0.75) return "bg-risk-high";
  return "bg-risk-critical";
};

// Map node type to icon
const NodeIcon = ({ category }: { category: string }) => {
  switch (category) {
    case "confidentiality":
      return <Key className="h-4 w-4 mr-1" />;
    case "integrity":
      return <Database className="h-4 w-4 mr-1" />;
    case "availability":
      return <LucideServer className="h-4 w-4 mr-1" />;
    default:
      return <Shield className="h-4 w-4 mr-1" />;
  }
};

// Node component for visualization
const NetworkNodeComponent = ({ node }: { node: NetworkNode }) => {
  const impactColor = getImpactColor(node.impactLevel);
  const categoryColor = categoryColors[node.category as keyof typeof categoryColors];
  
  return (
    <div className={`relative p-3 rounded-lg border shadow-sm ${node.impactLevel > 0 ? impactColor : "bg-gray-100"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <NodeIcon category={node.category} />
          <span className="font-medium">{node.name}</span>
        </div>
        <Badge variant="outline" className={`${categoryColor} text-white`}>
          {node.category.substring(0, 1).toUpperCase()}
        </Badge>
      </div>
      <div className="mt-2 text-sm">
        <div className="flex justify-between">
          <span>Importance:</span>
          <span>{node.importance}/10</span>
        </div>
        <div className="flex justify-between">
          <span>Impact:</span>
          <span>{Math.round(node.impactLevel * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

// Edge visualization component
const NetworkEdgeComponent = ({ 
  sourceNode, 
  targetNode, 
  edge 
}: { 
  sourceNode: NetworkNode; 
  targetNode: NetworkNode;
  edge: NetworkEdge;
}) => {
  return (
    <div className="flex items-center py-1">
      <div className="text-xs w-1/3 truncate">{sourceNode.name}</div>
      <div className="flex-grow text-center">
        <ArrowRight className="inline-block h-4 w-4 text-gray-500" />
        <div className="text-xs text-gray-500">
          {Math.round(edge.dependencyStrength * 100)}% strength
        </div>
      </div>
      <div className="text-xs w-1/3 truncate text-right">{targetNode.name}</div>
    </div>
  );
};

// Step visualization component (cascade steps)
const CascadeStepVisualization = ({ 
  cascadeLevels, 
  allNodes 
}: { 
  cascadeLevels: CascadeResults["cascadeLevels"];
  allNodes: NetworkNode[];
}) => {
  if (!cascadeLevels.length) return <div>No cascade data available</div>;
  
  return (
    <div className="space-y-6">
      {cascadeLevels.map((level, index) => (
        <div key={`level-${index}`} className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">
            {index === 0 ? "Initial Impact" : `Cascade Step ${index}`}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {level.map(impact => {
              const node = allNodes.find(n => n.id === impact.nodeId);
              if (!node) return null;
              
              return (
                <div key={impact.nodeId} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getImpactColor(impact.impactLevel)}`}></div>
                  <div className="flex-grow">
                    <div className="font-medium">{node.name}</div>
                    <div className="text-sm text-gray-500">
                      Impact: {Math.round(impact.impactLevel * 100)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const DependencyNetworkSimulation = ({ 
  businessProfile, 
  compromisedAccounts 
}: DependencyNetworkSimulationProps) => {
  const [network, setNetwork] = useState<{ nodes: NetworkNode[], edges: NetworkEdge[] } | null>(null);
  const [cascadeResults, setCascadeResults] = useState<CascadeResults | null>(null);
  
  useEffect(() => {
    if (businessProfile) {
      // Generate network based on business profile
      const defaultNetwork = generateDefaultNetwork(businessProfile);
      setNetwork(defaultNetwork);
      
      // Calculate cascade impact
      const results = calculateCascadeImpact(
        businessProfile,
        compromisedAccounts,
        defaultNetwork.nodes,
        defaultNetwork.edges
      );
      setCascadeResults(results);
    }
  }, [businessProfile, compromisedAccounts]);
  
  if (!network || !cascadeResults) {
    return <div>Loading dependency network...</div>;
  }
  
  // Group nodes by type for visualization
  const feederNodes = cascadeResults.nodes.filter(node => node.type === "feeder");
  const receiverNodes = cascadeResults.nodes.filter(node => node.type === "receiver");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChart className="h-5 w-5 mr-2" />
          Functional Dependency Network Analysis
        </CardTitle>
        <CardDescription>
          Visualize how phishing attacks cascade through your business systems
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="network">
          <TabsList className="mb-4">
            <TabsTrigger value="network">Network View</TabsTrigger>
            <TabsTrigger value="cascade">Cascade Steps</TabsTrigger>
          </TabsList>
          
          <TabsContent value="network">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Entry Points (Feeder Nodes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {feederNodes.map(node => (
                    <NetworkNodeComponent key={node.id} node={node} />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Laptop className="h-5 w-5 mr-2" />
                  Affected Systems (Receiver Nodes)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {receiverNodes.map(node => (
                    <NetworkNodeComponent key={node.id} node={node} />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Key Dependencies
                </h3>
                <div className="space-y-2 border rounded-lg p-4">
                  {network.edges.map((edge, index) => {
                    const sourceNode = network.nodes.find(n => n.id === edge.source);
                    const targetNode = network.nodes.find(n => n.id === edge.target);
                    
                    if (!sourceNode || !targetNode) return null;
                    
                    return (
                      <NetworkEdgeComponent 
                        key={`${edge.source}-${edge.target}-${index}`}
                        sourceNode={sourceNode}
                        targetNode={targetNode}
                        edge={edge}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cascade">
            <CascadeStepVisualization 
              cascadeLevels={cascadeResults.cascadeLevels}
              allNodes={cascadeResults.nodes}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DependencyNetworkSimulation;
