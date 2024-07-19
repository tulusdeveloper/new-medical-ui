import React from 'react';
import Link from 'next/link';
import { FlaskConical, Beaker, ClipboardList, ClipboardCheck, FileText, ChevronRight } from 'lucide-react';

// Define the structure of a laboratory module
interface LaboratoryModule {
  text: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  apiPath: string;
}

// Define the array of laboratory modules
const laboratoryModules: LaboratoryModule[] = [
  { text: "Lab Test Classes", href: "/home/laboratory/lab-test-classes", icon: FlaskConical, apiPath: "labTestClasses" },
  { text: "Lab Tests", href: "/home/laboratory/lab-tests", icon: Beaker, apiPath: "labTests" },
  { text: "Lab Test Formats", href: "/home/laboratory/lab-test-formats", icon: ClipboardList, apiPath: "labTestFormats" },
  { text: "Lab Orders", href: "/home/laboratory/lab-orders", icon: ClipboardCheck, apiPath: "labOrders" },
  { text: "Lab Results", href: "/home/laboratory/lab-results", icon: FileText, apiPath: "labResults" },
];

// Define the props for the LaboratoryDashboard component
interface LaboratoryDashboardProps {
  counts: Record<string, number>;
}

const LaboratoryDashboard: React.FC<LaboratoryDashboardProps> = ({ counts }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Laboratory Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {laboratoryModules.map((module, index) => {
          const Icon = module.icon;
          const count = counts[module.apiPath] ?? 'Loading...';

          return (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Icon className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">{module.text}</h3>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{count}</span>
                </div>
                <p className="text-gray-600 mb-4">Manage and view all {module.text.toLowerCase()}.</p>
                <div className="flex justify-between items-center">
                  <Link href={module.href} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LaboratoryDashboard;
