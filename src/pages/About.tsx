import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, DollarSign, TrendingDown, Shield, Network, 
  BarChart4, LineChart, Clock, Users
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            About PhishImpact
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Understanding the simulation methodology and calculations
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
              <Link to="/" className="text-phishing-600 hover:underline">← Back to simulator</Link>
            </p>
          </div>
        </header>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Simulation Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                PhishImpact uses a multi-layered approach to simulate the potential impact of phishing attacks on small businesses. 
                The simulation is based on three key parameters:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Phishing Rate:</strong> The percentage of employees who receive phishing emails.</li>
                <li><strong>Click-Through Rate:</strong> The percentage of recipients who click on phishing links.</li>
                <li><strong>Compromise Rate:</strong> The percentage of clicks that result in successful account compromise.</li>
              </ul>
              <p>
                These parameters, combined with your business profile information, drive all impact calculations through 
                the following formula:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <code>Compromised Accounts = Employee Count × Phishing Rate × Click-Through Rate × Compromise Rate</code>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="financial">
            <TabsList className="mb-4 grid grid-cols-1 md:grid-cols-3 w-full">
              <TabsTrigger value="financial">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial Impact Calculations
              </TabsTrigger>
              <TabsTrigger value="operational">
                <TrendingDown className="h-4 w-4 mr-2" />
                Operational Impact
              </TabsTrigger>
              <TabsTrigger value="network">
                <Network className="h-4 w-4 mr-2" />
                Network Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Financial Impact Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                  <section>
                    <h3 className="text-lg font-medium mb-2">Remediation Costs</h3>
                    <p>
                      Remediation costs represent direct expenses for incident response, system recovery, and security enhancement. The formula is:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>Remediation Costs = Compromised Accounts × Base Cost Per Compromise × (1 + Data Importance / 10)</code>
                    </div>
                    <p>Where:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Base Cost Per Compromise = $3,000 (industry average)</li>
                      <li>Data Importance = Your selected data sensitivity rating (1-10)</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Productivity Costs</h3>
                    <p>
                      Productivity costs measure the business impact of employee downtime and IT staff diversion following a breach:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>Productivity Costs = Compromised Accounts × Daily Productivity Cost × Average Downtime Days</code>
                    </div>
                    <p>Where:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Daily Productivity Cost = Average Salary / 240 Working Days Per Year</li>
                      <li>Average Downtime Days = 3 + (Compromised Accounts / Employee Count) × 10, capped at 14 days</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Revenue Loss</h3>
                    <p>
                      Revenue loss captures direct business impact from the attack:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Revenue Loss = Annual Revenue × Revenue Loss Percentage<br />
                        Revenue Loss Percentage = (Compromised Accounts / Employee Count) × (Critical Systems Count / 10) × Industry Risk Multiplier × 0.05
                      </code>
                    </div>
                    <p>
                      Revenue loss percentage is capped at 15% of annual revenue to maintain realistic estimates. Industry risk multipliers are pre-defined values that adjust impact based on your industry&apos;s risk profile:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Healthcare: 1.5×</li>
                      <li>Finance: 1.8×</li>
                      <li>Technology: 1.3×</li>
                      <li>Retail: 1.2×</li>
                      <li>Manufacturing: 1.0×</li>
                      <li>Education: 1.4×</li>
                      <li>Government: 1.6×</li>
                      <li>Nonprofit: 1.1×</li>
                      <li>Other: 1.0×</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Reputation Costs</h3>
                    <p>
                      Reputation costs estimate the long-term impact on customer trust and brand value:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Reputation Costs = Annual Revenue × 0.01 × Reputation Multiplier × min(Compromised Accounts / 5, 1)<br />
                        Reputation Multiplier = (Data Importance / 10) × Industry Risk Multiplier
                      </code>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Regulatory Fines</h3>
                    <p>
                      For businesses handling sensitive data (Data Importance &gt; 7), potential regulatory fines are calculated:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Regulatory Fines = Compromised Accounts × $500 × Industry Risk Multiplier
                      </code>
                    </div>
                    <p>
                      For businesses with Data Importance ≤ 7, regulatory fines are set to $0.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Total Financial Impact</h3>
                    <p>
                      The total financial impact combines all components:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Total Financial Impact = Remediation Costs + Productivity Costs + Revenue Loss + Reputation Costs + Regulatory Fines
                      </code>
                    </div>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="operational">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2" />
                    Operational Impact Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                  <section>
                    <h3 className="text-lg font-medium mb-2">Systems Downtime</h3>
                    <p>
                      The estimated hours of system unavailability:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Systems Downtime = Base Downtime × (1 + Compromised Percentage × Critical Systems Count) × (1 - Tech Maturity / 20)
                      </code>
                    </div>
                    <p>Where:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Base Downtime = 4 hours</li>
                      <li>Compromised Percentage = Compromised Accounts / Employee Count</li>
                      <li>Tech Maturity = Your selected technical maturity rating (1-10)</li>
                    </ul>
                    <p>
                      Higher technical maturity reduces downtime impact through more efficient recovery processes.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Productivity Loss</h3>
                    <p>
                      The percentage of organizational productivity lost during recovery:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Productivity Loss = min(Compromised Percentage × 100 × (Critical Systems Count / 5), 90)
                      </code>
                    </div>
                    <p>
                      Capped at 90% to reflect that some business functions typically remain operational.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Recovery Time</h3>
                    <p>
                      The estimated days until normal operations are restored:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Recovery Time = Base Recovery Time × (1 + Compromised Percentage × 10) × (1 - Tech Maturity / 20)
                      </code>
                    </div>
                    <p>Where:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Base Recovery Time = 1 day</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Affected Systems</h3>
                    <p>
                      The number of critical systems impacted by the attack:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Affected Systems = ceiling(Critical Systems Count × Compromised Percentage × 1.5)
                      </code>
                    </div>
                    <p>
                      The 1.5 multiplier reflects that a single compromised account often affects multiple systems.
                    </p>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Network className="h-5 w-5 mr-2" />
                    Network Analysis Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                  <section>
                    <h3 className="text-lg font-medium mb-2">Functional Dependency Network Analysis (FDNA)</h3>
                    <p>
                      PhishImpact uses FDNA to model cascade effects through your business systems. The network consists of:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Feeder Nodes:</strong> Initial attack entry points (email, credentials, workstations)</li>
                      <li><strong>Receiver Nodes:</strong> Critical business systems impacted by the attack</li>
                      <li><strong>Edges:</strong> Dependencies between systems with strengths from 0 to 1</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Node Vulnerability</h3>
                    <p>
                      Each node&apos;s vulnerability is calculated as:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Base Vulnerability = 1 - (Tech Maturity / 10)
                      </code>
                    </div>
                    <p>
                      Node-specific modifiers are then applied (e.g., email systems are typically 20% more vulnerable).
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Initial Impact Calculation</h3>
                    <p>
                      For feeder nodes, initial impact is calculated as:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Initial Impact = min(Compromised Accounts / Employee Count × Node Vulnerability × 2, 1)
                      </code>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">Cascade Propagation</h3>
                    <p>
                      Impact propagates through the network in steps:
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                      <code>
                        Propagated Impact = Source Node Impact × Edge Dependency Strength × Target Node Vulnerability
                      </code>
                    </div>
                    <p>
                      The simulation runs for up to 3 cascade steps or until no further impact propagates.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium mb-2">CIA Triad Analysis</h3>
                    <p>
                      The FDNA-Cyber Graph visualizes impacts across the CIA (Confidentiality, Integrity, Availability) security triad:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Confidentiality:</strong> Protection of sensitive information</li>
                      <li><strong>Integrity:</strong> Accuracy and trustworthiness of data</li>
                      <li><strong>Availability:</strong> Accessibility of systems and services</li>
                    </ul>
                    <p>
                      Dependencies between CIA elements are modeled using alpha (operability) and beta (strength) coefficients.
                    </p>
                  </section>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Risk Level Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Risk levels are calculated across multiple dimensions, with each dimension assessed on a four-point scale: 
                low, medium, high, or critical.
              </p>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Financial Risk</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Low:</strong> Financial impact &lt; 1% of annual revenue</li>
                  <li><strong>Medium:</strong> Financial impact between 1% and 5% of annual revenue</li>
                  <li><strong>High:</strong> Financial impact between 5% and 15% of annual revenue</li>
                  <li><strong>Critical:</strong> Financial impact &gt; 15% of annual revenue</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Operational Risk</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Low:</strong> Recovery time &lt; 2 days and productivity loss &lt; 20%</li>
                  <li><strong>Medium:</strong> Recovery time &lt; 5 days and productivity loss &lt; 40%</li>
                  <li><strong>High:</strong> Recovery time &lt; 10 days and productivity loss &lt; 70%</li>
                  <li><strong>Critical:</strong> Recovery time ≥ 10 days or productivity loss ≥ 70%</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Reputational Risk</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Low:</strong> Reputational impact &lt; 0.5% of annual revenue</li>
                  <li><strong>Medium:</strong> Reputational impact between 0.5% and 2% of annual revenue</li>
                  <li><strong>High:</strong> Reputational impact between 2% and 5% of annual revenue</li>
                  <li><strong>Critical:</strong> Reputational impact &gt; 5% of annual revenue</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Overall Risk</h3>
                <p>
                  Overall risk is calculated using a weighted average of the three risk dimensions:
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-2">
                  <code>
                    Average Risk Score = (Financial Risk Score + Operational Risk Score + Reputational Risk Score) / 3
                  </code>
                </div>
                <p>Where risk scores are:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Low = 1</li>
                  <li>Medium = 2</li>
                  <li>High = 3</li>
                  <li>Critical = 4</li>
                </ul>
                <p>Overall risk levels are determined as:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Low:</strong> Average score &lt; 1.5</li>
                  <li><strong>Medium:</strong> Average score between 1.5 and 2.5</li>
                  <li><strong>High:</strong> Average score between 2.5 and 3.5</li>
                  <li><strong>Critical:</strong> Average score ≥ 3.5</li>
                </ul>
              </section>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Incidence Variation Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The impact analysis at various incidence levels plots the relationship between phishing rate and impact. 
                This is calculated by:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Dividing the range from 0% to 50% phishing incidence into equal steps</li>
                <li>Calculating full simulation results at each step</li>
                <li>Visualizing the correlation between phishing rate and key impact metrics</li>
              </ol>
              <p>
                This analysis helps identify threshold points where minor increases in attack incidence lead to disproportionate impact increases.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Model Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The PhishImpact simulation model makes the following key assumptions to balance 
                accuracy with usability:
              </p>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Phishing Attack Assumptions</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Uniform Distribution:</strong> Phishing emails are assumed to be distributed 
                    uniformly across all employees, regardless of role or department.</li>
                  <li><strong>Consistent Behavior:</strong> All employees are assumed to have equal 
                    likelihood of clicking on phishing links, not accounting for varying security awareness.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Impact Scaling Assumptions</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Linear Scaling:</strong> Many impact calculations scale linearly with the 
                    number of compromised accounts, though real-world breaches may have non-linear effects.</li>
                  <li><strong>Industry Risk Multipliers:</strong> Fixed risk multipliers are used by industry, 
                    based on averages that may not perfectly represent specific organizations.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Recovery Assumptions</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Recovery Capability:</strong> Recovery time calculations assume typical 
                    recovery capabilities based on technical maturity rating.</li>
                  <li><strong>Working Calendar:</strong> Productivity calculations assume 240 working 
                    days per year for all businesses.</li>
                </ul>
              </section>
              
              <section>
                <h3 className="text-lg font-medium mb-2">Technical Assumptions</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Cascade Limits:</strong> Network simulation assumes a maximum of 3 cascade 
                    steps for impact propagation.</li>
                  <li><strong>Standard Costs:</strong> Base remediation cost per compromised account is 
                    assumed to be $3,000 (industry average).</li>
                </ul>
              </section>
              
              <p className="mt-4 text-sm italic">
                These assumptions help create a practical model while acknowledging that real-world scenarios 
                may have additional complexities not fully captured by the simulation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;
