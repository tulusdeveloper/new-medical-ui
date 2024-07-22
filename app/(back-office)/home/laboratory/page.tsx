"use client"
import React, { useState, useEffect } from 'react';
import LaboratoryDashboard from '@/components/laboratory/LaboratoryDashboard';
import { laboratoryApi } from '@/utils/api';
import withAuth from '@/utils/withAuth';

export type Counts = {
  labTestClasses: number;
  labTests: number;
  labTestFormats: number;
  labOrders: number;
  labResults: number;
};

const LaboratorySetup: React.FC = () => {
  const [counts, setCounts] = useState<Counts>({
    labTestClasses: 0,
    labTests: 0,
    labTestFormats: 0,
    labOrders: 0,
    labResults: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCounts();
  }, []);
  
  const fetchCounts = async () => {
    try {
      const [
        labTestClasses,
        labTests,
        labTestFormats,
        labOrders,
        labResults,
      ] = await Promise.all([
        laboratoryApi.fetchLabTestClasses(),
        laboratoryApi.fetchLabTests(),
        laboratoryApi.fetchLabTestFormats(),
        laboratoryApi.fetchLabOrders(),
        laboratoryApi.fetchLabResults(),
      ]);

      console.log('Raw API responses:', {
        labTestClasses,
        labTests,
        labTestFormats,
        labOrders,
        labResults
      });

      const getDataSafely = (response: any) => response?.data ?? response ?? [];

      const newCounts: Counts = {
        labTestClasses: getDataSafely(labTestClasses).length,
        labTests: getDataSafely(labTests).length,
        labTestFormats: getDataSafely(labTestFormats).length,
        labOrders: getDataSafely(labOrders).length,
        labResults: getDataSafely(labResults).length,
      };

      console.log('New counts to be set:', newCounts);
      setCounts(newCounts);
      setLoading(false);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchCounts();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div>
      <button 
        onClick={handleRefresh} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
      <LaboratoryDashboard counts={counts} />
    </div>
  );
}

export default withAuth(LaboratorySetup);