"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { patientsApi } from '@/utils/api'
import { Search, UserPlus, Edit, X, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Link from 'next/link'
import debounce from 'lodash/debounce'
import withAuth from '@/utils/withAuth'
import { useRouter } from 'next/navigation'
import PatientFormModal from './PatientFormModal'

interface Patient {
  id: string;
  first_name: string;
  other_names: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  primary_phone: string;
  blood_type: string;
  address: string;
  emergency_contact: string;
  medical_history: string;
}

function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedDetails, setExpandedDetails] = useState<{[key: string]: boolean}>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [patientsPerPage] = useState(10)
  const router = useRouter()

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await patientsApi.fetchPatients();
      setPatients(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      if (error.message === 'No authentication token found' || (error.response && error.response.status === 401)) {
        router.push('/auth/login');
      } else {
        setError('Failed to fetch patients. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (patient?: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(undefined);
  };

  const handleSavePatient = (savedPatient: Patient) => {
    setPatients(prevPatients => {
      if (savedPatient.id) {
        return prevPatients.map(p => p.id === savedPatient.id ? savedPatient : p);
      } else {
        return [...prevPatients, savedPatient];
      }
    });
    handleCloseModal();
  };

  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setCurrentPage(1)
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    if (searchInput) {
      searchInput.value = ""
    }
  }

  const sortedAndFilteredPatients = useMemo(() => {
    return patients
      .filter((patient) =>
        `${patient.first_name} ${patient.other_names} ${patient.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.primary_phone.includes(searchTerm)
      )
      .sort((a, b) => `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`))
  }, [patients, searchTerm])

  const toggleDetails = (id: string) => {
    setExpandedDetails(prev => ({...prev, [id]: !prev[id]}));
  };

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedAndFilteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(sortedAndFilteredPatients.length / patientsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Patient Management</h2>
        <div className="space-x-4">
          <Link
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 inline-flex items-center"
            href="/home/dashboard"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 inline-flex items-center"
          >
            <UserPlus className="mr-2" size={20} />
            Register New Patient
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <input
          id="search-input"
          type="text"
          placeholder="Search patients..."
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 "
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
          <p className="mt-2 text-gray-600">Loading patients...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-500 bg-red-100 border border-red-400 rounded-lg p-4">
          <p>{error}</p>
          <button
            onClick={fetchPatients}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Gender', 'Date of Birth', 'Phone', 'Email', 'Blood Type', 'Actions'].map((header, index) => (
                    <th 
                      key={index}
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPatients.map(patient => (
                  <React.Fragment key={patient.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{`${patient.last_name}, ${patient.first_name} ${patient.other_names}`}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(patient.date_of_birth).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.primary_phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.blood_type || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => toggleDetails(patient.id)} 
                          className="text-blue-600 hover:text-blue-900 mr-2"
                        >
                          <ChevronRight className={`inline mr-1 transform transition-transform ${expandedDetails[patient.id] ? 'rotate-90' : ''}`} size={16} /> 
                          {expandedDetails[patient.id] ? 'Hide' : 'View'}
                        </button>
                        <button 
                          onClick={() => handleOpenModal(patient)} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="inline mr-1" size={16} /> Edit
                        </button>
                      </td>
                    </tr>
                    {expandedDetails[patient.id] && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 px-6 py-4 text-gray-800">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                              <p><strong>Emergency Contact:</strong> {patient.emergency_contact || 'N/A'}</p>
                            </div>
                            <div>
                              <p><strong>Medical History:</strong> {patient.medical_history || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sortedAndFilteredPatients.length === 0 && !isLoading && !error && (
        <div className="text-center py-4 text-gray-500">
          No patients found matching your search.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ChevronsRight size={20} />
          </button>
        </div>
      )}

      {isModalOpen && (
        <PatientFormModal
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  )
}

export default withAuth(PatientList)