
import { ReactNode } from "react";
import { Shield } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-phishing-700 dark:bg-phishing-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">PhishImpact</span>
              </div>
              <div className="h-8 border-l border-white/20"></div>
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/20829841-25ab-474e-b04e-78576069dabd.png" 
                  alt="CCR Cyber Cascade Risk Lab" 
                  className="h-10"
                />
              </div>
            </div>
            <div>
              <span className="text-sm">Visualize. Simulate. Mitigate.</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-6">
        {children}
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PhishImpact Simulator - Helping small businesses understand phishing risks
            </p>
            <div className="flex items-center mt-2 md:mt-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">Powered by </span>
              <img 
                src="/lovable-uploads/20829841-25ab-474e-b04e-78576069dabd.png" 
                alt="CCR Cyber Cascade Risk Lab" 
                className="h-6 ml-2"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
