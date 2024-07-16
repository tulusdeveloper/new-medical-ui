"use client"
import React, { useState, useEffect } from 'react';
import {
  laboratoryApi,
  patientsApi,
  insuranceApi,
  visitTypeApi
} from '@/utils/api';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import withAuth from '@/utils/withAuth';

interface DashboardStats {
  labStats: { totalClasses: number };
  patientStats: { 
    totalPatients: number;
    genderDistribution: { gender: string; count: number }[];
  };
  insuranceStats: { totalInsurances: number };
  visitTypeStats: { totalVisitTypes: number };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    labStats: { totalClasses: 0 },
    patientStats: { totalPatients: 0, genderDistribution: [] },
    insuranceStats: { totalInsurances: 0 },
    visitTypeStats: { totalVisitTypes: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [labClasses, patients, insurances, visitTypes] = await Promise.all([
          laboratoryApi.fetchLabTestClasses(),
          patientsApi.fetchPatients(),
          insuranceApi.fetchInsurances(),
          visitTypeApi.fetchVisitTypes()
        ]);

        setStats({
          labStats: { totalClasses: labClasses.data.length },
          patientStats: {
            totalPatients: patients.data.length,
            genderDistribution: calculateGenderDistribution(patients.data),
          },
          insuranceStats: { totalInsurances: insurances.data.length },
          visitTypeStats: { totalVisitTypes: visitTypes.data.length },
        });
        
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateGenderDistribution = (patients: any[]): { gender: string; count: number }[] => {
    const distribution = patients.reduce((acc, patient) => {
      const gender = patient.gender as string;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
    return Object.entries(distribution).map(([gender, count]) => ({ gender, count: count as number }));
  };
  

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>MediCare Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Laboratory Statistics</h2>
          <p>Total Lab Test Classes: {stats.labStats.totalClasses}</p>
        </div>
        <div className="dashboard-card">
          <h2>Patient Statistics</h2>
          <p>Total Patients: {stats.patientStats.totalPatients}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.patientStats.genderDistribution}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {stats.patientStats.genderDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-card">
          <h2>Insurance Statistics</h2>
          <p>Total Insurances: {stats.insuranceStats.totalInsurances}</p>
        </div>
        <div className="dashboard-card">
          <h2>Visit Type Statistics</h2>
          <p>Total Visit Types: {stats.visitTypeStats.totalVisitTypes}</p>
        </div>
      </div>
      <style jsx>{`
        .dashboard {
          padding: 20px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .dashboard-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default withAuth(Dashboard);