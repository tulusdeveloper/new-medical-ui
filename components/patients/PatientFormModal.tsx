"use client";
import React, { useState, useEffect } from "react";
import { patientsApi } from "@/utils/api";
import withAuth from "@/utils/withAuth";
import { FaSave, FaTimes, FaUser, FaIdCard, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserFriends, FaTint, FaAllergies, FaNotesMedical, FaUserMd } from 'react-icons/fa';
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
  const router = useRouter();
  const isEditMode = !!patient;

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          // Handle other errors (e.g., show an error message to the user)
          console.error("Other error occurred:", errorWithResponse.message);
        }
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {isEditMode ? "Edit Patient" : "Register New Patient"}
          </h2>
          
          {/* Personal Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaUser className="mr-2" /> Personal Information</h3>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="other_names"
              value={formData.other_names}
              onChange={handleChange}
              placeholder="Other Names"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaIdCard className="mr-2" /> Contact Information</h3>
            <input
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              placeholder="National ID"
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="primary_phone"
              value={formData.primary_phone}
              onChange={handleChange}
              placeholder="Primary Phone"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="secondary_phone"
              value={formData.secondary_phone}
              onChange={handleChange}
              placeholder="Secondary Phone"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Next of Kin */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaUserFriends className="mr-2" /> Next of Kin</h3>
            <input
              type="text"
              name="next_of_kin_name"
              value={formData.next_of_kin_name}
              onChange={handleChange}
              placeholder="Next of Kin Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="next_of_kin_contact"
              value={formData.next_of_kin_contact}
              onChange={handleChange}
              placeholder="Next of Kin Contact"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="next_of_kin_relationship"
              value={formData.next_of_kin_relationship}
              onChange={handleChange}
              placeholder="Next of Kin Relationship"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Medical Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaNotesMedical className="mr-2" /> Medical Information</h3>
            <select
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="Allergies"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="chronic_conditions"
              value={formData.chronic_conditions}
              onChange={handleChange}
              placeholder="Chronic Conditions"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="referral_source"
              value={formData.referral_source}
              onChange={handleChange}
              placeholder="Referral Source"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
            >
              <FaSave className="mr-2" /> {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(PatientFormModal);