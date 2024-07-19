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
    ageDistribution: { ageGroup: string; count: number }[];
  };
  insuranceStats: { totalInsurances: number };
  visitTypeStats: { totalVisitTypes: number };
  departmentStats: { totalDepartments: number };
}

const initialStats: DashboardStats = {
  labStats: { totalClasses: 0, totalTests: 0 },
  patientStats: { 
    totalPatients: 0, 
    genderDistribution: [],
    ageDistribution: []
  },
  insuranceStats: { totalInsurances: 0 },
  visitTypeStats: { totalVisitTypes: 0 },
  departmentStats: { totalDepartments: 0 },
};

interface Patient {
  gender: string;
  dateOfBirth: string;
  // Add other patient properties as needed
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          labClassesResponse,
          labTestsResponse,
          patientsResponse,
          insurancesResponse,
          visitTypesResponse,
          departmentsResponse
        ] = await Promise.all([
          laboratoryApi.fetchLabTestClasses(),
          laboratoryApi.fetchLabTests(),
          patientsApi.fetchPatients(),
          insuranceApi.fetchInsurances(),
          visitTypeApi.fetchVisitTypes(),
          departmentApi.fetchDepartments()
        ]);
    
        // Extract the counts from the data property of each response
        const labClassesCount = labClassesResponse.data.length;
        const labTestsCount = labTestsResponse.data.length;
        const patientsCount = patientsResponse.data.length;
        const insurancesCount = insurancesResponse.data.length;
        const visitTypesCount = visitTypesResponse.data.length;
        const departmentsCount = departmentsResponse.data.length;
    
        console.log('API response counts:', { 
          labClassesCount, 
          labTestsCount, 
          patientsCount, 
          insurancesCount, 
          visitTypesCount, 
          departmentsCount 
        });
    
        const newStats: DashboardStats = {
          labStats: { 
            totalClasses: labClassesCount,
            totalTests: labTestsCount
          },
          patientStats: {
            totalPatients: patientsCount,
            genderDistribution: calculateGenderDistribution(patientsResponse.data),
            ageDistribution: calculateAgeDistribution(patientsResponse.data),
          },
          insuranceStats: { totalInsurances: insurancesCount },
          visitTypeStats: { totalVisitTypes: visitTypesCount },
          departmentStats: { totalDepartments: departmentsCount },
        };
        
        console.log('New stats to be set:', newStats);
        setStats(newStats);
        setLoading(false);
      } catch (err) {
        console.error('Detailed error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStats(initialStats);
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
  
  const calculateGenderDistribution = (patients: Patient[]): { gender: string; count: number }[] => {
    const distribution = patients.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([gender, count]) => ({ gender, count }));
  };

  const calculateAgeDistribution = (patients: Patient[]): { ageGroup: string; count: number }[] => {
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-70': 0,
      '71+': 0
    };

    patients.forEach((patient) => {
      const age = calculateAge(patient.dateOfBirth);
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 30) ageGroups['19-30']++;
      else if (age <= 50) ageGroups['31-50']++;
      else if (age <= 70) ageGroups['51-70']++;
      else ageGroups['71+']++;
    });

    return Object.entries(ageGroups).map(([ageGroup, count]) => ({ ageGroup, count }));
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

        <ChartCard title="Patient Age Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.patientStats.ageDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
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