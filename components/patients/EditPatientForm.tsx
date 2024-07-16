"use client";
import React, { useState } from "react";
import { patientsApi } from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { FaSave, FaTimes, FaUser, FaIdCard, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaUserFriends, FaTint, FaAllergies, FaNotesMedical, FaUserMd } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Patient {
  id: string;
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

interface EditPatientFormProps {
  patient: Patient;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

function EditPatientForm({ patient, onSave, onCancel }: EditPatientFormProps) {
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await patientsApi.updatePatient(editedPatient.id, editedPatient);
      onSave(response.data);
    } catch (error: unknown) {
      console.error("Error updating patient:", error);
      if (error instanceof Error) {
        if ('response' in error && typeof error.response === 'object' && error.response && 'status' in error.response) {
          if (error.response.status === 401) {
            router.push('/auth/login');
          } else {
            // Handle other errors (e.g., show an error message to the user)
            console.error("Other error occurred:", error.message);
          }
        } else {
          console.error("Unexpected error structure:", error.message);
        }
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Patient Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaUser className="mr-2" /> Personal Information</h3>
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={editedPatient.first_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="other_names" className="block text-sm font-medium text-gray-700">Other Names</label>
            <input
              type="text"
              id="other_names"
              name="other_names"
              value={editedPatient.other_names}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={editedPatient.last_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              value={editedPatient.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={editedPatient.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaIdCard className="mr-2" /> Contact Information</h3>
          <div>
            <label htmlFor="national_id" className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              type="text"
              id="national_id"
              name="national_id"
              value={editedPatient.national_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="primary_phone" className="block text-sm font-medium text-gray-700">Primary Phone</label>
            <input
              type="tel"
              id="primary_phone"
              name="primary_phone"
              value={editedPatient.primary_phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="secondary_phone" className="block text-sm font-medium text-gray-700">Secondary Phone</label>
            <input
              type="tel"
              id="secondary_phone"
              name="secondary_phone"
              value={editedPatient.secondary_phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedPatient.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={editedPatient.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaUserFriends className="mr-2" /> Next of Kin</h3>
          <div>
            <label htmlFor="next_of_kin_name" className="block text-sm font-medium text-gray-700">Next of Kin Name</label>
            <input
              type="text"
              id="next_of_kin_name"
              name="next_of_kin_name"
              value={editedPatient.next_of_kin_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="next_of_kin_contact" className="block text-sm font-medium text-gray-700">Next of Kin Contact</label>
            <input
              type="tel"
              id="next_of_kin_contact"
              name="next_of_kin_contact"
              value={editedPatient.next_of_kin_contact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="next_of_kin_relationship" className="block text-sm font-medium text-gray-700">Next of Kin Relationship</label>
            <input
              type="text"
              id="next_of_kin_relationship"
              name="next_of_kin_relationship"
              value={editedPatient.next_of_kin_relationship}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center"><FaNotesMedical className="mr-2" /> Medical Information</h3>
          <div>
            <label htmlFor="blood_type" className="block text-sm font-medium text-gray-700">Blood Type</label>
            <input
              type="text"
              id="blood_type"
              name="blood_type"
              value={editedPatient.blood_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={editedPatient.allergies}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="chronic_conditions" className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
            <input
              type="text"
              id="chronic_conditions"
              name="chronic_conditions"
              value={editedPatient.chronic_conditions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="referral_source" className="block text-sm font-medium text-gray-700">Referral Source</label>
            <input
              type="text"
              id="referral_source"
              name="referral_source"
              value={editedPatient.referral_source}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
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
          <FaSave className="mr-2" /> Save Changes
        </button>
      </div>
    </form>
  );
}

export default withAuth(EditPatientForm);