import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/`;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: any) => {
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
function showLoginModal(): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  }
}

// Function to check if the user is authenticated
const isAuthenticated = (): boolean => {
  return typeof window !== 'undefined' && !!localStorage.getItem('token');
};

// Wrapper function for API calls
const authenticatedRequest = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  if (!isAuthenticated()) {
    throw new Error('User is not authenticated');
  }
  return apiCall();
};

// Define interfaces for API functions
interface LabTestClass {
  category: any;
  is_active: boolean;
  id?: number;
  name: string;
  description?: string;
}

interface LabTest {
  id?: number;
  name: string;
  labTestClass: number;
  description?: string;
}

interface LabTestFormat {
  id?: number;
  name: string;
  description?: string;
}

interface LabOrder {
  id?: number;
  patient: number;
  tests: number[];
  orderedBy: number;
  orderDate: string;
}

interface LabResult {
  id?: number;
  labOrder: number;
  test: number;
  result: string;
  performedBy: number;
  performedDate: string;
}

interface LabComment {
  id?: number;
  labResult: number;
  comment: string;
  commentedBy: number;
  commentDate: string;
}

interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
}

interface Insurance {
  id?: number;
  name: string;
  policyNumber: string;
  coverage: string;
}

interface VisitType {
  id?: number;
  name: string;
  description?: string;
}

interface Department {
  id?: number;
  name: string;
  description?: string;
}

interface DepartmentGroup {
  id?: number;
  name: string;
  departments: number[];
}

interface DepartmentPermission {
  id?: number;
  department: number;
  permission: string;
}

// Laboratory API functions
const laboratoryApi = {
  // Lab Test Classes CRUD
  fetchLabTestClasses: async (): Promise<LabTestClass[]> => {
    const response = await api.get<LabTestClass[]>('laboratory/lab-test-classes/');
    return response.data;
  },
  createLabTestClass: (data: LabTestClass) => authenticatedRequest<LabTestClass>(() => api.post('laboratory/lab-test-classes/', data)),
  updateLabTestClass: (id: number, data: LabTestClass) => authenticatedRequest<LabTestClass>(() => api.put(`laboratory/lab-test-classes/${id}/`, data)),
  deleteLabTestClass: (id: number) => authenticatedRequest<void>(() => api.delete(`laboratory/lab-test-classes/${id}/`)),

  // Lab Tests CRUD
  fetchLabTests: () => authenticatedRequest<LabTest[]>(() => api.get('laboratory/lab-tests/')),
  createLabTest: (data: LabTest) => authenticatedRequest<LabTest>(() => api.post('laboratory/lab-tests/', data)),
  updateLabTest: (id: number, data: LabTest) => authenticatedRequest<LabTest>(() => api.put(`laboratory/lab-tests/${id}/`, data)),
  deleteLabTest: (id: number) => authenticatedRequest<void>(() => api.delete(`laboratory/lab-tests/${id}/`)),
  
  // Lab Test Formats
  fetchLabTestFormats: () => authenticatedRequest<LabTestFormat[]>(() => api.get('laboratory/lab-test-formats/')),
  createLabTestFormats: (data: LabTestFormat) => authenticatedRequest<LabTestFormat>(() => api.post('laboratory/lab-test-formats/', data)),
  updateLabTestFormats: (id: number, data: LabTestFormat) => authenticatedRequest<LabTestFormat>(() => api.put(`laboratory/lab-test-formats/${id}/`, data)),
  deleteLabTestFormats: (id: number) => authenticatedRequest<void>(() => api.delete(`laboratory/lab-test-formats/${id}/`)),

  // Lab Orders
  fetchLabOrders: () => authenticatedRequest<LabOrder[]>(() => api.get('laboratory/lab-orders/')),
  createLabOrder: (data: LabOrder) => authenticatedRequest<LabOrder>(() => api.post('laboratory/lab-orders/', data)),
  updateLabOrder: (id: number, data: LabOrder) => authenticatedRequest<LabOrder>(() => api.put(`laboratory/lab-orders/${id}/`, data)),
  deleteLabOrder: (id: number) => authenticatedRequest<void>(() => api.delete(`laboratory/lab-orders/${id}/`)),

  // Lab Results
  fetchLabResults: () => authenticatedRequest<LabResult[]>(() => api.get('laboratory/lab-results/')),
  createLabResult: (data: LabResult) => authenticatedRequest<LabResult>(() => api.post('laboratory/lab-results/', data)),
  updateLabResult: (id: number, data: LabResult) => authenticatedRequest<LabResult>(() => api.put(`laboratory/lab-results/${id}/`, data)),
  deleteLabResult: (id: number) => authenticatedRequest<void>(() => api.delete(`laboratory/lab-results/${id}/`)),

  // Lab Comments
  fetchLabComments: () => authenticatedRequest<LabComment[]>(() => api.get('laboratory/lab-comments/')),
  createLabComment: (data: LabComment) => authenticatedRequest<LabComment>(() => api.post('laboratory/lab-comments/', data)),
  updateLabComment: (id: number, data: LabComment) => authenticatedRequest<LabComment>(() => api.put(`laboratory/lab-comments/${id}/`, data)),
  deleteLabComment: (id: number) => authenticatedRequest<void>(() => api.delete(`laboratory/lab-comments/${id}/`)),

  // Additional specific methods
  fetchLabTestById: (id: number) => authenticatedRequest<LabTest>(() => api.get(`laboratory/lab-tests/${id}/`)),
  fetchLabOrderById: (id: number) => authenticatedRequest<LabOrder>(() => api.get(`laboratory/lab-orders/${id}/`)),
  fetchLabResultById: (id: number) => authenticatedRequest<LabResult>(() => api.get(`laboratory/lab-results/${id}/`)),
};

// Patients API functions
const patientsApi = {
  fetchPatients: () => authenticatedRequest<Patient[]>(() => api.get('patients/')),
  fetchPatient: (id: number) => authenticatedRequest<Patient>(() => api.get(`patients/${id}/`)),
  createPatient: (patientData: Patient) => authenticatedRequest<Patient>(() => api.post('patients/', patientData)),
  updatePatient: (id: number, patientData: Patient) => authenticatedRequest<Patient>(() => api.put(`patients/${id}/`, patientData)),
  deletePatient: (id: number) => authenticatedRequest<void>(() => api.delete(`patients/${id}/`)),
};

// Insurance API Functions
const insuranceApi = {
  fetchInsurances: () => authenticatedRequest<Insurance[]>(() => api.get('insurances/')),
  fetchInsurance: (id: number) => authenticatedRequest<Insurance>(() => api.get(`insurances/${id}/`)),
  createInsurance: (insuranceData: Insurance) => authenticatedRequest<Insurance>(() => api.post('insurances/', insuranceData)),
  updateInsurance: (id: number, insuranceData: Insurance) => authenticatedRequest<Insurance>(() => api.put(`insurances/${id}/`, insuranceData)),
  deleteInsurance: (id: number) => authenticatedRequest<void>(() => api.delete(`insurances/${id}/`)),
};

// Visit Type API Functions
const visitTypeApi = {
  fetchVisitTypes: () => authenticatedRequest<VisitType[]>(() => api.get('visit-types/')),
  fetchVisitType: (id: number) => authenticatedRequest<VisitType>(() => api.get(`visit-types/${id}/`)),
  createVisitType: (visitTypeData: VisitType) => authenticatedRequest<VisitType>(() => api.post('visit-types/', visitTypeData)),
  updateVisitType: (id: number, visitTypeData: VisitType) => authenticatedRequest<VisitType>(() => api.put(`visit-types/${id}/`, visitTypeData)),
  deleteVisitType: (id: number) => authenticatedRequest<void>(() => api.delete(`visit-types/${id}/`)),
};

// Department API Functions
const departmentApi = {
  fetchDepartments: () => authenticatedRequest<Department[]>(() => api.get('staff-management/departments/')),
  fetchDepartment: (id: number) => authenticatedRequest<Department>(() => api.get(`staff-management/departments/${id}/`)),
  createDepartment: (departmentData: Department) => authenticatedRequest<Department>(() => api.post('staff-management/departments/', departmentData)),
  updateDepartment: (id: number, departmentData: Department) => authenticatedRequest<Department>(() => api.put(`staff-management/departments/${id}/`, departmentData)),
  deleteDepartment: (id: number) => authenticatedRequest<void>(() => api.delete(`staff-management/departments/${id}/`)),
};

// Department Group API Functions
const departmentGroupApi = {
  fetchDepartmentGroups: () => authenticatedRequest<DepartmentGroup[]>(() => api.get('staff-management/department-groups/')),
  fetchDepartmentGroup: (id: number) => authenticatedRequest<DepartmentGroup>(() => api.get(`staff-management/department-groups/${id}/`)),
  createDepartmentGroup: (data: DepartmentGroup) => authenticatedRequest<DepartmentGroup>(() => api.post('staff-management/department-groups/', data)),
  updateDepartmentGroup: (id: number, data: DepartmentGroup) => authenticatedRequest<DepartmentGroup>(() => api.put(`staff-management/department-groups/${id}/`, data)),
  deleteDepartmentGroup: (id: number) => authenticatedRequest<void>(() => api.delete(`staff-management/department-groups/${id}/`)),
};

// Department Permission API Functions
const departmentPermissionApi = {
  fetchDepartmentPermissions: () => authenticatedRequest<DepartmentPermission[]>(() => api.get('staff-management/department-permissions/')),
};

// Logout function
const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = null;
  }
};

export { api, laboratoryApi, patientsApi, insuranceApi, visitTypeApi, departmentApi, departmentGroupApi, departmentPermissionApi, isAuthenticated, logout };