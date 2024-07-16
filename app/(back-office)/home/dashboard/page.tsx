"use client";
import React, { useState, useEffect } from 'react';
import {
  laboratoryApi,
  patientsApi,
  insuranceApi,
  visitTypeApi,
  departmentApi
} from '@/utils/api';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import withAuth from '@/utils/withAuth';
import { FaUserMd, FaFlask, FaUserInjured, FaHospital } from 'react-icons/fa';

interface DashboardStats {
  labStats: { totalClasses: number; totalTests: number };
  patientStats: { 
    totalPatients: number;
    genderDistribution: { gender: string; count: number }[];
  };
  insuranceStats: { totalInsurances: number };
  visitTypeStats: { totalVisitTypes: number };
  departmentStats: { totalDepartments: number };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    labStats: { totalClasses: 0, totalTests: 0 },
    patientStats: { totalPatients: 0, genderDistribution: [] },
    insuranceStats: { totalInsurances: 0 },
    visitTypeStats: { totalVisitTypes: 0 },
    departmentStats: { totalDepartments: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [labClasses, labTests, patients, insurances, visitTypes, departments] = await Promise.all([
          laboratoryApi.fetchLabTestClasses(),
          laboratoryApi.fetchLabTests(),
          patientsApi.fetchPatients(),
          insuranceApi.fetchInsurances(),
          visitTypeApi.fetchVisitTypes(),
          departmentApi.fetchDepartments()
        ]);

        setStats({
          labStats: { 
            totalClasses: labClasses.data.length,
            totalTests: labTests.data.length
          },
          patientStats: {
            totalPatients: patients.data.length,
            genderDistribution: calculateGenderDistribution(patients.data),
          },
          insuranceStats: { totalInsurances: insurances.data.length },
          visitTypeStats: { totalVisitTypes: visitTypes.data.length },
          departmentStats: { totalDepartments: departments.data.length },
        });
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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

  if (loading) return <div className="text-center text-gray-500">Loading dashboard...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">MediCare Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={<FaFlask />} title="Lab Tests" value={stats.labStats.totalTests} subtitle="Total Tests" />
        <KPICard icon={<FaUserInjured />} title="Patients" value={stats.patientStats.totalPatients} subtitle="Total Patients" />
        <KPICard icon={<FaHospital />} title="Departments" value={stats.departmentStats.totalDepartments} subtitle="Total Departments" />
        <KPICard icon={<FaUserMd />} title="Visit Types" value={stats.visitTypeStats.totalVisitTypes} subtitle="Total Visit Types" />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
        <ChartCard title="Patient Gender Distribution">
          <ResponsiveContainer width="100%" height={300}>
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
        </ChartCard>

        <ChartCard title="Lab Statistics">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Test Classes', value: stats.labStats.totalClasses },
              { name: 'Total Tests', value: stats.labStats.totalTests }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ icon: React.ReactNode; title: string; value: number; subtitle: string }> = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className="text-3xl text-blue-500 mr-4">{icon}</div>
    <div>
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    {children}
  </div>
);

export default withAuth(Dashboard);