import React, { useState } from "react";
import { Edit, ToggleLeft, ToggleRight, AlertCircle, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

interface LabTest {
  id: number;
  name: string;
  code: string;
  price: number;
  is_active: boolean;
  test_class_name: string;
  has_subtests: boolean;
  units?: string;
  male_lower_limit?: number;
  male_upper_limit?: number;
  female_lower_limit?: number;
  female_upper_limit?: number;
  reference_notes?: string;
}

interface LabTestListProps {
  labTests: LabTest[];
  onEdit: (labTest: LabTest) => void;
}

const LabTestList: React.FC<LabTestListProps> = ({ labTests, onEdit }) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedDetails, setExpandedDetails] = useState<Record<number, boolean>>({});

  if (!labTests || labTests.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No lab tests</h3>
        <p className="mt-1 text-sm text-gray-500">No lab tests are available at this time.</p>
      </div>
    );
  }

  const groupedTests = labTests.reduce<Record<string, LabTest[]>>((acc, test) => {
    const group = test.test_class_name || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(test);
    return acc;
  }, {});

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({...prev, [group]: !prev[group]}));
  };

  const toggleDetails = (id: number) => {
    setExpandedDetails(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedTests).map(([group, tests]) => (
        <div key={group} className="bg-white shadow-md rounded-lg overflow-hidden">
          <button
            className="w-full bg-gray-100 px-4 py-3 text-left font-medium flex justify-between items-center text-slate-800"
            onClick={() => toggleGroup(group)}
          >
            {group}
            {expandedGroups[group] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedGroups[group] && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tests.map((labTest) => (
                    <React.Fragment key={labTest.id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                        <td className="py-4 px-4 whitespace-nowrap text-slate-800">{labTest.name}</td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-800">{labTest.code}</td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-800">
                          ${typeof labTest.price === "number" ? labTest.price.toFixed(2) : parseFloat(labTest.price).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap ">
                          {labTest.is_active ? (
                            <span className="flex items-center text-green-600">
                              <ToggleRight className="mr-1" size={16} /> Active
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <ToggleLeft className="mr-1" size={16} /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            onClick={() => onEdit(labTest)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out mr-2"
                            aria-label={`Edit ${labTest.name}`}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => toggleDetails(labTest.id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150 ease-in-out"
                            aria-label={`Toggle details for ${labTest.name}`}
                          >
                            <ChevronRight className={`w-5 h-5 transform transition-transform ${expandedDetails[labTest.id] ? 'rotate-90' : ''}`} />
                          </button>
                        </td>
                      </tr>
                      {expandedDetails[labTest.id] && (
                        <tr>
                          <td colSpan={5} className="bg-gray-50 p-4">
                            <div className="grid grid-cols-2 gap-4 text-slate-800">
                              <div>
                                <p><strong>Has Subtests:</strong> {labTest.has_subtests ? 'Yes' : 'No'}</p>
                                <p><strong>Units:</strong> {labTest.units || 'N/A'}</p>
                                <p><strong>Male Lower Limit:</strong> {labTest.male_lower_limit || 'N/A'}</p>
                              </div>
                              <div>
                                <p><strong>Male Upper Limit:</strong> {labTest.male_upper_limit || 'N/A'}</p>
                                <p><strong>Female Lower Limit:</strong> {labTest.female_lower_limit || 'N/A'}</p>
                                <p><strong>Female Upper Limit:</strong> {labTest.female_upper_limit || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="mt-2 text-slate-800">
                              <p><strong>Reference Notes:</strong> {labTest.reference_notes || 'N/A'}</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LabTestList;