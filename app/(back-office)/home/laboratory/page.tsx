"use client"
import React, { useState, useEffect } from 'react';
import LaboratoryDashboard from '@/components/laboratory/LaboratoryDashboard';
import { laboratoryApi } from '@/utils/api';
import withAuth from '@/utils/withAuth';

type Counts = Record<string, number>;

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
  
      setCounts({
        labTestClasses: labTestClasses.length,
        labTests: labTests.length,
        labTestFormats: labTestFormats.length,
        labOrders: labOrders.length,
        labResults: labResults.length,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching counts:', error);
      setError('Failed to fetch laboratory data. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <LaboratoryDashboard counts={counts} />
    </div>
  );
}

export default withAuth(LaboratorySetup);