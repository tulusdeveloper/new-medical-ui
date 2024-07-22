"use client";
import React, { useState, useEffect, useMemo } from 'react';
import LabTestClassList from '@/components/laboratory/LabTestClassList';
import LabTestClassModal from '@/components/laboratory/LabTestClassModal';
import { PlusCircle, Search, X } from "lucide-react";
import Link from "next/link";
import debounce from "lodash/debounce";
import withAuth from '@/utils/withAuth';
import { laboratoryApi } from '@/utils/api';

interface LabTestClass {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  category?: string;
}

function LabTestClassesPage() {
  const [labTestClasses, setLabTestClasses] = useState<LabTestClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLabTestClass, setSelectedLabTestClass] = useState<LabTestClass | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchLabTestClasses();
  }, []);

  const fetchLabTestClasses = async () => {
    setIsLoading(true);
    try {
      const response = await laboratoryApi.fetchLabTestClasses();
      console.log('API response:', response);
      setLabTestClasses(response.data); // Access the data property here
      setError(null);
    } catch (error) {
      console.error('Error fetching lab test classes:', error);
      setError("Failed to fetch lab test classes. Please try again later.");
      setLabTestClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (labTestClass: LabTestClass) => {
    setSelectedLabTestClass(labTestClass);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchLabTestClasses();
    setIsModalOpen(false);
    setSelectedLabTestClass(null);
  };

  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    if (searchInput) {
      searchInput.value = "";
    }
  };

  const filteredClasses = useMemo(() => {
    if (!Array.isArray(labTestClasses)) {
      console.error('labTestClasses is not an array:', labTestClasses);
      return [];
    }
    return labTestClasses.filter((labTestClass) =>
      labTestClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labTestClass.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [labTestClasses, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">Lab Test Classes</h2>
        <div className="space-x-4">
          <Link
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 inline-flex items-center"
            href="/home/laboratory"
          >
            Back to Lab Setup
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 inline-flex items-center"
          >
            <PlusCircle className="mr-2" size={20} />
            Add New Class
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <input
          id="search-input"
          type="text"
          placeholder="Search classes..."
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lab test classes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500 bg-red-100 border border-red-400 rounded-lg p-4">
          <p>{error}</p>
          <button
            onClick={fetchLabTestClasses}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      ) : (
        <LabTestClassList
          labTestClasses={filteredClasses}
          onEdit={handleEdit}
        />
      )}

      {filteredClasses.length === 0 && !isLoading && !error && (
        <div className="text-center py-4 text-gray-500">
          No lab test classes found matching your search.
        </div>
      )}

      <LabTestClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={selectedLabTestClass}
      />
    </div>
  );
}

export default withAuth(LabTestClassesPage);
