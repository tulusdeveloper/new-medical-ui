"use client"
import { laboratoryApi } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface LabTestClass {
  id?: number;
  name: string;
  description: string;
  is_active: boolean;
  category: string;
}

interface LabTestClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: LabTestClass | null;
}

const LabTestClassModal: React.FC<LabTestClassModalProps> = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState<LabTestClass>({
    name: '',
    description: '',
    is_active: true,
    category: '' 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: '',
          description: '',
          is_active: true,
          category: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateForm = (): Record<string, string> => {
    let tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
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
          await laboratoryApi.updateLabTestClass(initialData.id, formData);
        } else {
          await laboratoryApi.createLabTestClass(formData);
        }
        onSuccess();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: 'An error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (initialData && initialData.id && window.confirm('Are you sure you want to delete this lab test class?')) {
      setIsLoading(true);
      try {
        await laboratoryApi.deleteLabTestClass(initialData.id);
        onSuccess();
        handleClose();
      } catch (error) {
        console.error('Error deleting lab test class:', error);
        setErrors({ submit: 'An error occurred while deleting. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      is_active: true,
      category: '' 
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{initialData ? 'Edit' : 'Add'} Lab Test Class</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={28} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            {errors.name && (
              <p className="flex items-center mt-2 text-red-600">
                <AlertCircle size={16} className="mr-1" />
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className="flex items-center text-lg">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="font-medium text-gray-700">Is Active</span>
            </label>
          </div>
          {errors.submit && (
            <p className="flex items-center text-red-600 bg-red-100 p-3 rounded-md">
              <AlertCircle size={20} className="mr-2" />
              {errors.submit}
            </p>
          )}
          <div className="flex justify-between items-center pt-4">
            {initialData && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTestClassModal;