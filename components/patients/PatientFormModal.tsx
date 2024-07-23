"use client";
import React, { useState, useEffect } from "react";
import { patientsApi } from "@/utils/api";
import withAuth from "@/utils/withAuth";
import {
  FaSave, FaTimes, FaUser, FaIdCard, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaUserFriends, FaTint, FaAllergies, FaNotesMedical, FaUserMd
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Patient {
  id?: string;
  first_name: string;
  other_names: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  national_id: string;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  address: string;
  next_of_kin_name: string;
  next_of_kin_contact: string;
  next_of_kin_relationship: string;
  blood_type: string;
  allergies: string;
  chronic_conditions: string;
  referral_source: string;
}

interface PatientFormModalProps {
  patient?: Patient;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

const initialPatientState: Patient = {
  first_name: "",
  other_names: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  national_id: "",
  primary_phone: "",
  secondary_phone: "",
  email: "",
  address: "",
  next_of_kin_name: "",
  next_of_kin_contact: "",
  next_of_kin_relationship: "",
  blood_type: "",
  allergies: "",
  chronic_conditions: "",
  referral_source: "",
};

function PatientFormModal({ patient, onSave, onCancel }: PatientFormModalProps) {
  const [formData, setFormData] = useState<Patient>(initialPatientState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEditMode = !!patient;

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['first_name', 'last_name', 'gender', 'date_of_birth', 'primary_phone', 'address', 'next_of_kin_name', 'next_of_kin_contact', 'next_of_kin_relationship'];
    for (const field of requiredFields) {
      if (!formData[field as keyof Patient]) {
        setError(`Please fill in all required fields. Missing: ${field.replace('_', ' ')}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isEditMode) {
        response = await patientsApi.updatePatient(formData.id!, formData);
      } else {
        response = await patientsApi.createPatient(formData);
      }
      onSave(response.data);
    } catch (error: unknown) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} patient:`, error);
      if (error instanceof Error && 'response' in error) {
        const errorWithResponse = error as any;
        if (errorWithResponse.response?.status === 401) {
          router.push('/auth/login');
        } else {
          setError("An error occurred while saving the patient. Please try again.");
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-8 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 border-b pb-2">
            {isEditMode ? "Edit Patient Record" : "New Patient Registration"}
          </h2>
          
          {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

          {/* Patient Demographics */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <FaUser className="mr-2" /> Patient Demographics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name*</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Other Names</label>
                <input
                  type="text"
                  name="other_names"
                  value={formData.other_names}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender*</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth*</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
              <FaIdCard className="mr-2" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">National ID</label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Phone*</label>
                <input
                  type="tel"
                  name="primary_phone"
                  value={formData.primary_phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Secondary Phone</label>
                <input
                  type="tel"
                  name="secondary_phone"
                  value={formData.secondary_phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-slate-800"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center">
              <FaUserFriends className="mr-2" /> Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Next of Kin Name*</label>
                <input
                  type="text"
                  name="next_of_kin_name"
                  value={formData.next_of_kin_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next of Kin Contact*</label>
                <input
                  type="tel"
                  name="next_of_kin_contact"
                  value={formData.next_of_kin_contact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relationship to Patient*</label>
                <input
                  type="text"
                  name="next_of_kin_relationship"
                  value={formData.next_of_kin_relationship}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 text-slate-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Clinical Information */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
              <FaNotesMedical className="mr-2" /> Clinical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                <select
                  name="blood_type"
                  value={formData.blood_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-slate-800"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any known allergies"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-slate-800"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
                <textarea
                  name="chronic_conditions"
                  value={formData.chronic_conditions}
                  onChange={handleChange}
                  placeholder="List any chronic conditions"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-slate-800"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Referral Source</label>
                <input
                  type="text"
                  name="referral_source"
                  value={formData.referral_source}
                  onChange={handleChange}
                  placeholder="e.g. GP, Specialist, Self-referral"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 ${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                <FaSave className="mr-2" />
              )}
              {isEditMode ? "Update Patient Record" : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(PatientFormModal);