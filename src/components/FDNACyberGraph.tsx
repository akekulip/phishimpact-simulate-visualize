
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FDNAGraph, FDNAGraphNode, FDNAGraphEdge } from "@/types/simulationTypes";
import { BusinessProfile } from "@/types/businessTypes";
import { Circle, ArrowRight, Shield, AlertTriangle, Check } from "lucide-react";

interface FDNACyberGraphProps {
  businessProfile: BusinessProfile;
  compromisedAccounts: number;
}

// Colors for CIA sections
const CIA_COLORS = {
  confidentiality: "#81A1C1", // Light blue
  integrity: "#88C0D0",       // Medium blue
  availability: "#5E81AC",    // Dark blue
  feederBorder: "#4C566A",
  receiverBorder: "#D8DEE9",
  nodeBg: "#ECEFF4",
  textDark: "#2E3440",
  edgePrimary: "#81A1C1",
  edgeSecondary: "#5E81AC"
};

// Create a chart component for a node
const NodeChart = ({ node }: { node: FDNAGraphNode }) => {
  const size = 120; // Size of the node
  const radius = size / 2;
  const center = size / 2;
  const borderWidth = node.type === "feeder" ? 3 : 2;
  const borderColor = node.type === "feeder" ? CIA_COLORS.feederBorder : CIA_COLORS.receiverBorder;
  
  // Calculate the angles for each section (C, I, A)
  const confidentialityAngle = Math.PI * 2 * (1/3);
  const integrityAngle = Math.PI * 2 * (1/3);
  const availabilityAngle = Math.PI * 2 * (1/3);
  
  // Calculate paths for each section
  const confidentialityPath = `
    M ${center} ${center}
    L ${center} ${center - radius}
    A ${radius} ${radius} 0 0 1 ${center + radius * Math.sin(confidentialityAngle)} ${center - radius * Math.cos(confidentialityAngle)}
    Z
  `;
  
  const integrityPath = `
    M ${center} ${center}
    L ${center + radius * Math.sin(confidentialityAngle)} ${center - radius * Math.cos(confidentialityAngle)}
    A ${radius} ${radius} 0 0 1 ${center + radius * Math.sin(confidentialityAngle + integrityAngle)} ${center - radius * Math.cos(confidentialityAngle + integrityAngle)}
    Z
  `;
  
  const availabilityPath = `
    M ${center} ${center}
    L ${center + radius * Math.sin(confidentialityAngle + integrityAngle)} ${center - radius * Math.cos(confidentialityAngle + integrityAngle)}
    A ${radius} ${radius} 0 0 1 ${center} ${center - radius}
    Z
  `;
  
  // Calculate label positions
  const cLabelX = center + (radius * 0.6) * Math.sin(confidentialityAngle / 2);
  const cLabelY = center - (radius * 0.6) * Math.cos(confidentialityAngle / 2);
  
  const iLabelX = center + (radius * 0.6) * Math.sin(confidentialityAngle + integrityAngle / 2);
  const iLabelY = center - (radius * 0.6) * Math.cos(confidentialityAngle + integrityAngle / 2);
  
  const aLabelX = center + (radius * 0.6) * Math.sin(confidentialityAngle + integrityAngle + availabilityAngle / 2);
  const aLabelY = center - (radius * 0.6) * Math.cos(confidentialityAngle + integrityAngle + availabilityAngle / 2);
  
  // Calculate transparency based on performance
  const getOpacity = (baseValue: number) => {
    return 0.3 + (baseValue * 0.7); // Scale opacity from 30% to 100%
  };
  
  const confidentialityOpacity = getOpacity(node.confidentiality);
  const integrityOpacity = getOpacity(node.integrity);
  const availabilityOpacity = getOpacity(node.availability);
  
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={center} cy={center} r={radius} fill={CIA_COLORS.nodeBg} stroke={borderColor} strokeWidth={borderWidth} />
        
        {/* CIA sections */}
        <path d={confidentialityPath} fill={CIA_COLORS.confidentiality} fillOpacity={confidentialityOpacity} />
        <path d={integrityPath} fill={CIA_COLORS.integrity} fillOpacity={integrityOpacity} />
        <path d={availabilityPath} fill={CIA_COLORS.availability} fillOpacity={availabilityOpacity} />
        
        {/* CIA labels */}
        <text x={cLabelX} y={cLabelY} textAnchor="middle" fontSize="12" fill={CIA_COLORS.textDark} fontWeight="bold">C</text>
        <text x={iLabelX} y={iLabelY} textAnchor="middle" fontSize="12" fill={CIA_COLORS.textDark} fontWeight="bold">I</text>
        <text x={aLabelX} y={aLabelY} textAnchor="middle" fontSize="12" fill={CIA_COLORS.textDark} fontWeight="bold">A</text>
        
        {/* Performance label "P" at the center */}
        <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fontSize="16" fill={CIA_COLORS.textDark} fontWeight="bold">
          P
        </text>
      </svg>
      
      {/* Node label */}
      <div className="text-center mt-2 font-medium text-sm">
        {node.name}
        {node.type === "feeder" ? (
          <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">Feeder</span>
        ) : (
          <span className="ml-1 text-xs bg-gray-100 text-gray-800 px-1 rounded">Receiver</span>
        )}
      </div>
      
      {/* Performance value */}
      <div className="text-center text-xs text-gray-500">
        Performance: {Math.round(node.performance * 100)}%
      </div>
    </div>
  );
};

// An edge connecting two nodes
const EdgeConnector = ({ edge, sourceNode, targetNode }: { 
  edge: FDNAGraphEdge; 
  sourceNode: FDNAGraphNode;
  targetNode: FDNAGraphNode;
}) => {
  // Get category shorthand
  const getCategory = (cat: "confidentiality" | "integrity" | "availability") => {
    return cat.substring(0, 1).toUpperCase();
  };
  
  return (
    <div className="flex items-center py-1 px-2 border border-gray-200 rounded-md">
      <div className="text-xs flex-1">
        {sourceNode.name} ({getCategory(edge.sourceCategory)})
      </div>
      <div className="flex-1 flex flex-col items-center px-2">
        <ArrowRight className="h-4 w-4 text-blue-500" />
        <div className="text-xs text-gray-500 mt-1">
          <span className="bg-blue-50 text-blue-700 px-1 rounded">α: {edge.alpha.toFixed(2)}</span>
          <span className="mx-1">|</span>
          <span className="bg-blue-50 text-blue-700 px-1 rounded">β: {edge.beta.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-xs flex-1 text-right">
        {targetNode.name} ({getCategory(edge.targetCategory)})
      </div>
    </div>
  );
};

// Generate FDNA graph data based on business profile and compromise level
const generateFDNAGraphData = (
  businessProfile: BusinessProfile,
  compromisedAccounts: number
): FDNAGraph => {
  const { employeeCount, techMaturity, dataImportance, criticalSystemsCount } = businessProfile;
  
  // Calculate compromise ratio
  const compromiseRatio = compromisedAccounts / employeeCount;
  
  // Base vulnerability based on tech maturity (inverse relationship)
  const baseVulnerability = 1 - (techMaturity / 10);
  
  // Calculate performance impact based on compromise
  const calculatePerformance = (importance: number, vulnerability: number) => {
    return Math.max(0, 1 - (compromiseRatio * vulnerability * (importance / 10)));
  };
  
  // Create nodes
  const nodes: FDNAGraphNode[] = [
    // Feeder node
    {
      id: "user_systems",
      name: "User Systems",
      type: "feeder",
      confidentiality: calculatePerformance(8, baseVulnerability * 1.2),
      integrity: calculatePerformance(7, baseVulnerability * 1.1),
      availability: calculatePerformance(6, baseVulnerability),
      performance: calculatePerformance(7, baseVulnerability * 1.1),
    },
    
    // Receiver node
    {
      id: "business_systems",
      name: "Business Systems",
      type: "receiver",
      confidentiality: calculatePerformance(dataImportance, baseVulnerability * 0.9),
      integrity: calculatePerformance(criticalSystemsCount, baseVulnerability * 0.8),
      availability: calculatePerformance(8, baseVulnerability * 0.9),
      performance: calculatePerformance((dataImportance + criticalSystemsCount + 8) / 3, baseVulnerability * 0.9),
    }
  ];
  
  // Create edges
  const edges: FDNAGraphEdge[] = [
    {
      id: "c_to_c",
      source: "user_systems",
      target: "business_systems",
      sourceCategory: "confidentiality",
      targetCategory: "confidentiality",
      alpha: 0.8, // High operability dependency
      beta: 0.7,  // Moderate strength dependency
    },
    {
      id: "i_to_i",
      source: "user_systems",
      target: "business_systems",
      sourceCategory: "integrity",
      targetCategory: "integrity",
      alpha: 0.7,
      beta: 0.8,
    },
    {
      id: "a_to_a",
      source: "user_systems",
      target: "business_systems",
      sourceCategory: "availability",
      targetCategory: "availability",
      alpha: 0.6,
      beta: 0.6,
    },
    {
      id: "c_to_i",
      source: "user_systems",
      target: "business_systems",
      sourceCategory: "confidentiality",
      targetCategory: "integrity",
      alpha: 0.5,
      beta: 0.6,
    },
    {
      id: "i_to_a",
      source: "user_systems",
      target: "business_systems",
      sourceCategory: "integrity",
      targetCategory: "availability",
      alpha: 0.4,
      beta: 0.5,
    }
  ];
  
  return { nodes, edges };
};

// Main component
const FDNACyberGraph = ({ businessProfile, compromisedAccounts }: FDNACyberGraphProps) => {
  const [graphData, setGraphData] = useState<FDNAGraph | null>(null);
  
  useEffect(() => {
    if (businessProfile) {
      // Generate graph data
      const data = generateFDNAGraphData(businessProfile, compromisedAccounts);
      setGraphData(data);
    }
  }, [businessProfile, compromisedAccounts]);
  
  if (!graphData) {
    return <div>Loading FDNA graph...</div>;
  }
  
  // Get node by ID
  const getNodeById = (id: string) => {
    return graphData.nodes.find(node => node.id === id);
  };
  
  // Get overall system performance
  const getOverallPerformance = () => {
    const receiver = graphData.nodes.find(node => node.type === "receiver");
    return receiver ? receiver.performance : 0;
  };
  
  // Performance level indicator
  const getPerformanceLevel = (performance: number) => {
    if (performance > 0.8) return { label: "High", icon: <Check className="h-4 w-4 text-green-500" /> };
    if (performance > 0.5) return { label: "Medium", icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
    return { label: "Low", icon: <Shield className="h-4 w-4 text-red-500" /> };
  };
  
  const overallPerformance = getOverallPerformance();
  const performanceLevel = getPerformanceLevel(overallPerformance);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>FDNA-Cyber Graph Analysis</CardTitle>
        <CardDescription>
          Visualization of Functional Dependency Network Analysis for Cybersecurity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">Overall System Performance:</span> {Math.round(overallPerformance * 100)}%
          </div>
          <div className="flex items-center bg-white px-3 py-1 rounded-full border">
            {performanceLevel.icon}
            <span className="ml-1 text-sm font-medium">{performanceLevel.label} Performance</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">FDNA Model Visualization</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Nodes Visualization */}
            <div className="grid grid-cols-2 gap-10 justify-items-center">
              {graphData.nodes.map(node => (
                <NodeChart key={node.id} node={node} />
              ))}
              <img 
                src="/lovable-uploads/244bbad3-6f5c-4dad-a694-eb10b652ca84.png" 
                alt="FDNA Graph Reference" 
                className="col-span-2 w-full max-w-[300px] mx-auto mt-4 opacity-30" 
              />
            </div>
            
            {/* Edges Visualization */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2">Dependency Relationships</h4>
              {graphData.edges.map(edge => {
                const sourceNode = getNodeById(edge.source);
                const targetNode = getNodeById(edge.target);
                
                if (!sourceNode || !targetNode) return null;
                
                return (
                  <EdgeConnector 
                    key={edge.id} 
                    edge={edge} 
                    sourceNode={sourceNode} 
                    targetNode={targetNode} 
                  />
                );
              })}
              
              <div className="mt-6 bg-blue-50 p-3 rounded-lg text-sm">
                <h4 className="font-medium mb-1">FDNA Parameters Explanation</h4>
                <ul className="space-y-1 text-gray-700">
                  <li><span className="font-medium">α (alpha):</span> Operability dependency parameter</li>
                  <li><span className="font-medium">β (beta):</span> Strength dependency parameter</li>
                  <li><span className="font-medium">C/I/A:</span> Confidentiality, Integrity, Availability triad</li>
                  <li><span className="font-medium">P:</span> Performance level of the node</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FDNACyberGraph;
