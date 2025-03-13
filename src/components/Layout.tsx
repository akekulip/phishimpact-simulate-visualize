
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
            <div className="flex items-center">
              <Shield className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">PhishImpact</span>
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
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            PhishImpact Simulator - Helping small businesses understand phishing risks
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
