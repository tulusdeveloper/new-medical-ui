// utils/api.js
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized, show login modal
          showLoginModal();
          break;
        case 403:
          // Forbidden, might want to show an error message
          console.error('Access forbidden');
          break;
        // Add more cases as needed
      }
    }
    return Promise.reject(error);
  }
);

// Function to show login modal
function showLoginModal() {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  }
}

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return typeof window !== 'undefined' && !!localStorage.getItem('token');
};

// Wrapper function for API calls
const authenticatedRequest = async (apiCall) => {
  if (!isAuthenticated()) {
    throw new Error('User is not authenticated');
  }
  return apiCall();
};

// Laboratory API functions
const laboratoryApi = {
  // Lab Test Classes CRUD
  fetchLabTestClasses: () => authenticatedRequest(() => api.get('laboratory/lab-test-classes/')),
  createLabTestClass: (data) => authenticatedRequest(() => api.post('laboratory/lab-test-classes/', data)),
  updateLabTestClass: (id, data) => authenticatedRequest(() => api.put(`laboratory/lab-test-classes/${id}/`, data)),
  deleteLabTestClass: (id) => authenticatedRequest(() => api.delete(`laboratory/lab-test-classes/${id}/`)),

  // Lab Tests CRUD
  fetchLabTests: () => authenticatedRequest(() => api.get('laboratory/lab-tests/')),
  createLabTest: (data) => authenticatedRequest(() => api.post('laboratory/lab-tests/', data)),
  updateLabTest: (id, data) => authenticatedRequest(() => api.put(`laboratory/lab-tests/${id}/`, data)),
  deleteLabTest: (id) => authenticatedRequest(() => api.delete(`laboratory/lab-tests/${id}/`)),
  
  // Lab Test Formats
  fetchLabTestFormats: () => authenticatedRequest(() => api.get('laboratory/lab-test-formats/')),
  createLabTestFormats: (data) => authenticatedRequest(() => api.post('laboratory/lab-test-formats/', data)),
  updateLabTestFormats: (id, data) => authenticatedRequest(() => api.put(`laboratory/lab-test-formats/${id}/`, data)),
  deleteLabTestFormats: (id) => authenticatedRequest(() => api.delete(`laboratory/lab-test-formats/${id}/`)),

  // Lab Orders
  fetchLabOrders: () => authenticatedRequest(() => api.get('laboratory/lab-orders/')),
  createLabOrder: (data) => authenticatedRequest(() => api.post('laboratory/lab-orders/', data)),
  updateLabOrder: (id, data) => authenticatedRequest(() => api.put(`laboratory/lab-orders/${id}/`, data)),
  deleteLabOrder: (id) => authenticatedRequest(() => api.delete(`laboratory/lab-orders/${id}/`)),

  // Lab Results
  fetchLabResults: () => authenticatedRequest(() => api.get('laboratory/lab-results/')),
  createLabResult: (data) => authenticatedRequest(() => api.post('laboratory/lab-results/', data)),
  updateLabResult: (id, data) => authenticatedRequest(() => api.put(`laboratory/lab-results/${id}/`, data)),
  deleteLabResult: (id) => authenticatedRequest(() => api.delete(`laboratory/lab-results/${id}/`)),

  // Lab Comments
  fetchLabComments: () => authenticatedRequest(() => api.get('laboratory/lab-comments/')),
  createLabComment: (data) => authenticatedRequest(() => api.post('laboratory/lab-comments/', data)),
  updateLabComment: (id, data) => authenticatedRequest(() => api.put(`laboratory/lab-comments/${id}/`, data)),
  deleteLabComment: (id) => authenticatedRequest(() => api.delete(`laboratory/lab-comments/${id}/`)),

  // Additional specific methods
  fetchLabTestById: (id) => authenticatedRequest(() => api.get(`laboratory/lab-tests/${id}/`)),
  fetchLabOrderById: (id) => authenticatedRequest(() => api.get(`laboratory/lab-orders/${id}/`)),
  fetchLabResultById: (id) => authenticatedRequest(() => api.get(`laboratory/lab-results/${id}/`)),
};

// Patients API functions
const patientsApi = {
  fetchPatients: () => authenticatedRequest(() => api.get('patients/')),
  fetchPatient: (id) => authenticatedRequest(() => api.get(`patients/${id}/`)),
  createPatient: (patientData) => authenticatedRequest(() => api.post('patients/', patientData)),
  updatePatient: (id, patientData) => authenticatedRequest(() => api.put(`patients/${id}/`, patientData)),
  deletePatient: (id) => authenticatedRequest(() => api.delete(`patients/${id}/`)),
};

// Insurance API Functions
const insuranceApi = {
  fetchInsurances: () => authenticatedRequest(() => api.get('insurances/')),
  fetchInsurance: (id) => authenticatedRequest(() => api.get(`insurances/${id}/`)),
  createInsurance: (insuranceData) => authenticatedRequest(() => api.post('insurances/', insuranceData)),
  updateInsurance: (id, insuranceData) => authenticatedRequest(() => api.put(`insurances/${id}/`, insuranceData)),
  deleteInsurance: (id) => authenticatedRequest(() => api.delete(`insurances/${id}/`)),
};

// Visit Type API Functions
const visitTypeApi = {
  fetchVisitTypes: () => authenticatedRequest(() => api.get('visit-types/')),
  fetchVisitType: (id) => authenticatedRequest(() => api.get(`visit-types/${id}/`)),
  createVisitType: (visitTypeData) => authenticatedRequest(() => api.post('visit-types/', visitTypeData)),
  updateVisitType: (id, visitTypeData) => authenticatedRequest(() => api.put(`visit-types/${id}/`, visitTypeData)),
  deleteVisitType: (id) => authenticatedRequest(() => api.delete(`visit-types/${id}/`)),
};

// Department API Functions
const departmentApi = {
  fetchDepartments: () => authenticatedRequest(() => api.get('staff-management/departments/')),
  fetchDepartment: (id) => authenticatedRequest(() => api.get(`staff-management/departments/${id}/`)),
  createDepartment: (departmentData) => authenticatedRequest(() => api.post('staff-management/departments/', departmentData)),
  updateDepartment: (id, departmentData) => authenticatedRequest(() => api.put(`staff-management/departments/${id}/`, departmentData)),
  deleteDepartment: (id) => authenticatedRequest(() => api.delete(`staff-management/departments/${id}/`)),
};

// Department Group API Functions
const departmentGroupApi = {
  fetchDepartmentGroups: () => authenticatedRequest(() => api.get('staff-management/department-groups/')),
  fetchDepartmentGroup: (id) => authenticatedRequest(() => api.get(`staff-management/department-groups/${id}/`)),
  createDepartmentGroup: (data) => authenticatedRequest(() => api.post('staff-management/department-groups/', data)),
  updateDepartmentGroup: (id, data) => authenticatedRequest(() => api.put(`staff-management/department-groups/${id}/`, data)),
  deleteDepartmentGroup: (id) => authenticatedRequest(() => api.delete(`staff-management/department-groups/${id}/`)),
};

// Department Permission API Functions
const departmentPermissionApi = {
  fetchDepartmentPermissions: () => authenticatedRequest(() => api.get('staff-management/department-permissions/')),
};


// Logout function
const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = null;
    window.location.href = '/auth/login';
  }
};

export { api, laboratoryApi, patientsApi, insuranceApi, visitTypeApi, departmentApi, departmentGroupApi, departmentPermissionApi, isAuthenticated, logout };