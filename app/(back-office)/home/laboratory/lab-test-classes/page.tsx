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
  id: string;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
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
    // Check if response is an array
    if (Array.isArray(response)) {
      setLabTestClasses(response);
    } else {
      console.error('Unexpected response format:', response);
      setError("Received unexpected data format from the server.");
    }
    setError(null);
  } catch (error) {
    console.error('Error fetching lab test classes:', error);
    setError("Failed to fetch lab test classes. Please try again later.");
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
    return labTestClasses.filter((labTestClass) =>
      labTestClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labTestClass.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [labTestClasses, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (rest of the JSX remains the same) ... */}
    </div>
  );
}

export default withAuth(LabTestClassesPage);