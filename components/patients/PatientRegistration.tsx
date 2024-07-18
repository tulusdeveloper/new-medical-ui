"use client";
import React, { useState } from "react";
import { patientsApi } from "@/utils/api";
import withAuth from "@/utils/withAuth";
import {
  FaSave,
  FaTimes,
  FaUser,
  FaIdCard,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserFriends,
  FaTint,
  FaAllergies,
  FaNotesMedical,
  FaUserMd,
} from "react-icons/fa";

interface Patient {
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

interface PatientRegistrationProps {
  onCancel: () => void;
  onRegistrationSuccess: (patient: Patient) => void;
}

function PatientRegistration({ onCancel, onRegistrationSuccess }: PatientRegistrationProps) {
  const [newPatient, setNewPatient] = useState<Patient>({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await patientsApi.createPatient(newPatient);
      onRegistrationSuccess(response.data);
    } catch (error) {
      console.error("Error registering patient:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Register New Patient
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <FaUser className="mr-2" /> Personal Information
          </h3>
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={newPatient.first_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md text-gray-900 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="other_names"
              className="block text-sm font-medium text-gray-700"
            >
              Other Names
            </label>
            <input
              type="text"
              id="other_names"
              name="other_names"
              value={newPatient.other_names}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={newPatient.last_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={newPatient.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={newPatient.date_of_birth}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <FaIdCard className="mr-2" /> Contact Information
          </h3>
          <div>
            <label
              htmlFor="national_id"
              className="block text-sm font-medium text-gray-700"
            >
              National ID
            </label>
            <input
              type="text"
              id="national_id"
              name="national_id"
              value={newPatient.national_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="primary_phone"
              className="block text-sm font-medium text-gray-700"
            >
              Primary Phone
            </label>
            <input
              type="tel"
              id="primary_phone"
              name="primary_phone"
              value={newPatient.primary_phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="secondary_phone"
              className="block text-sm font-medium text-gray-700"
            >
              Secondary Phone
            </label>
            <input
              type="tel"
              id="secondary_phone"
              name="secondary_phone"
              value={newPatient.secondary_phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={newPatient.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={newPatient.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <FaUserFriends className="mr-2" /> Next of Kin
          </h3>
          <div>
            <label
              htmlFor="next_of_kin_name"
              className="block text-sm font-medium text-gray-700"
            >
              Next of Kin Name
            </label>
            <input
              type="text"
              id="next_of_kin_name"
              name="next_of_kin_name"
              value={newPatient.next_of_kin_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="next_of_kin_contact"
              className="block text-sm font-medium text-gray-700"
            >
              Next of Kin Contact
            </label>
            <input
              type="tel"
              id="next_of_kin_contact"
              name="next_of_kin_contact"
              value={newPatient.next_of_kin_contact}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="next_of_kin_relationship"
              className="block text-sm font-medium text-gray-700"
            >
              Next of Kin Relationship
            </label>
            <input
              type="text"
              id="next_of_kin_relationship"
              name="next_of_kin_relationship"
              value={newPatient.next_of_kin_relationship}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center">
            <FaNotesMedical className="mr-2" /> Medical Information
          </h3>
          <div>
            <label
              htmlFor="blood_type"
              className="block text-sm font-medium text-gray-700"
            >
              Blood Type
            </label>
            <select
              id="blood_type"
              name="blood_type"
              value={newPatient.blood_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-900"
            >
              <option value="">Select blood type</option>
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
          <div>
            <label
              htmlFor="allergies"
              className="block text-sm font-medium text-gray-700"
            >
              Allergies
            </label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={newPatient.allergies}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="chronic_conditions"
              className="block text-sm font-medium text-gray-700"
            >
              Chronic Conditions
            </label>
            <input
              type="text"
              id="chronic_conditions"
              name="chronic_conditions"
              value={newPatient.chronic_conditions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="referral_source"
              className="block text-sm font-medium text-gray-700"
            >
              Referral Source
            </label>
            <input
              type="text"
              id="referral_source"
              name="referral_source"
              value={newPatient.referral_source}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 border border-gray-300 rounded-md shadow-sm transition-all duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm transition-all duration-200 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transform hover:scale-105"
        >
          <FaSave className="mr-2" />
          Save
        </button>
      </div>
    </form>
  );
}

export default withAuth(PatientRegistration);