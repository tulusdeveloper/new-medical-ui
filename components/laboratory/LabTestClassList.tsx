import React, { useState } from 'react';
import { Edit, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface LabTestClass {
  id: string;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
}

interface LabTestClassListProps {
  labTestClasses: LabTestClass[];
  onEdit: (labTestClass: LabTestClass) => void;
}

const LabTestClassList: React.FC<LabTestClassListProps> = ({ labTestClasses, onEdit }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  if (!labTestClasses || labTestClasses.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No lab test classes</h3>
        <p className="mt-1 text-sm text-gray-500">No lab test classes are available at this time.</p>
      </div>
    );
  }

  const groupedClasses = labTestClasses.reduce((acc: Record<string, LabTestClass[]>, labTestClass) => {
    const group = labTestClass.category || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(labTestClass);
    return acc;
  }, {});

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({...prev, [group]: !prev[group]}));
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedClasses).map(([group, classes]) => (
        <div key={group} className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* ... (rest of the JSX remains the same) ... */}
        </div>
      ))}
    </div>
  );
};

export default LabTestClassList;