"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { laboratoryApi } from "@/utils/api";

interface LabTest {
  id?: number;
  name: string;
  code: string;
  price: string;
  test_class: string;
  is_active: boolean;
  has_subtests: boolean;
  units: string;
  male_lower_limit: string;
  male_upper_limit: string;
  female_lower_limit: string;
  female_upper_limit: string;
  reference_notes: string;
}

interface TestClass {
  id: number;
  name: string;
}

interface LabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: LabTest | null;
}

const LabTestModal: React.FC<LabTestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<LabTest>({
    name: "",
    code: "",
    price: "",
    test_class: "",
    is_active: true,
    has_subtests: false,
    units: "",
    male_lower_limit: "",
    male_upper_limit: "",
    female_lower_limit: "",
    female_upper_limit: "",
    reference_notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testClasses, setTestClasses] = useState<TestClass[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchTestClasses();
      if (initialData) {
        setFormData(initialData);
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const [isLoadingTestClasses, setIsLoadingTestClasses] = useState(false);

  const fetchTestClasses = async () => {
    setIsLoadingTestClasses(true);
    try {
      const response = await laboratoryApi.fetchLabTestClasses();
      setTestClasses(response.data);
      console.log("Fetched test classes:", response.data);
    } catch (error) {
      console.error("Error fetching test classes:", error);
    } finally {
      setIsLoadingTestClasses(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      price: "",
      test_class: "",
      is_active: true,
      has_subtests: false,
      units: "",
      male_lower_limit: "",
      male_upper_limit: "",
      female_lower_limit: "",
      female_upper_limit: "",
      reference_notes: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = () => {
    let tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.code.trim()) tempErrors.code = "Code is required";
    if (!formData.price.trim()) tempErrors.price = "Price is required";
    if (!formData.test_class) tempErrors.test_class = "Test Class is required";
    return tempErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tempErrors = validateForm();
    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      setIsLoading(true);
      try {
        if (initialData && initialData.id) {
          await laboratoryApi.updateLabTest(initialData.id, formData);
        } else {
          await laboratoryApi.createLabTest(formData);
        }
        onSuccess();
        handleClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors({ submit: "An error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {initialData ? "Edit" : "Add"} Lab Test
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-slate-800"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="code"
                className="block mb-1 font-medium text-slate-800"
              >
                Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                required
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="price"
                className="block mb-1 font-medium text-slate-800"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                required
                step="0.01"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="test_class"
                className="block mb-1 font-medium text-slate-800"
              >
                Test Class
              </label>
              <select
                id="test_class"
                name="test_class"
                value={formData.test_class}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                required
              >
                <option value="">Select Test Class</option>
                {isLoadingTestClasses ? (
                  <option value="" disabled>
                    Loading test classes...
                  </option>
                ) : testClasses && testClasses.length > 0 ? (
                  testClasses.map((testClass) => (
                    <option key={testClass.id} value={testClass.id}>
                      {testClass.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No test classes available
                  </option>
                )}
              </select>
              {errors.test_class && (
                <p className="text-red-500 text-sm mt-1 text-slate-800">
                  {errors.test_class}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Debug:{" "}
                {testClasses
                  ? `${testClasses.length} classes loaded`
                  : "No classes loaded"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-slate-800">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2 "
              />
              <span>Is Active</span>
            </label>
            <label className="flex items-center text-slate-800">
              <input
                type="checkbox"
                name="has_subtests"
                checked={formData.has_subtests}
                onChange={handleChange}
                className="mr-2 text-slate-800"
              />
              <span>Has Subtests</span>
            </label>
          </div>
          <div>
            <label
              htmlFor="units"
              className="block mb-1 font-medium text-slate-800"
            >
              Units
            </label>
            <input
              type="text"
              id="units"
              name="units"
              value={formData.units}
              onChange={handleChange}
              className="w-full p-2 border rounded text-slate-800"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-800">
            <div>
              <label
                htmlFor="male_lower_limit"
                className="block mb-1 font-medium text-slate-800"
              >
                Male Lower Limit
              </label>
              <input
                type="number"
                id="male_lower_limit"
                name="male_lower_limit"
                value={formData.male_lower_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                step="any"
              />
            </div>
            <div>
              <label
                htmlFor="male_upper_limit"
                className="block mb-1 font-medium text-slate-800"
              >
                Male Upper Limit
              </label>
              <input
                type="number"
                id="male_upper_limit"
                name="male_upper_limit"
                value={formData.male_upper_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                step="any"
              />
            </div>
            <div>
              <label
                htmlFor="female_lower_limit"
                className="block mb-1 font-medium text-slate-800"
              >
                Female Lower Limit
              </label>
              <input
                type="number"
                id="female_lower_limit"
                name="female_lower_limit"
                value={formData.female_lower_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                step="any"
              />
            </div>
            <div>
              <label
                htmlFor="female_upper_limit"
                className="block mb-1 font-medium text-slate-800"
              >
                Female Upper Limit
              </label>
              <input
                type="number"
                id="female_upper_limit"
                name="female_upper_limit"
                value={formData.female_upper_limit}
                onChange={handleChange}
                className="w-full p-2 border rounded text-slate-800"
                step="any"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="reference_notes"
              className="block mb-1 font-medium text-slate-800"
            >
              Reference Notes
            </label>
            <textarea
              id="reference_notes"
              name="reference_notes"
              value={formData.reference_notes}
              onChange={handleChange}
              className="w-full p-2 border rounded text-slate-800"
              rows="3"
            ></textarea>
          </div>
          {errors.submit && (
            <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTestModal;
