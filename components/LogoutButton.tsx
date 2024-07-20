"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/api';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoutButtonProps {
  isCollapsed: boolean;
}

export default function LogoutButton({ isCollapsed }: LogoutButtonProps) {
  const router = useRouter();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout(); // Call the logout function
      router.push('/auth/login'); // Handle redirection here
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        className={`flex items-center px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 transition-colors ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <FaSignOutAlt className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
        {!isCollapsed && <span className="font-medium">Log Out</span>}
      </button>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
            >
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimes className="h-6 w-6" />
              </button>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Confirm Logout</h3>
              <p className="mb-6 text-gray-600">Are you sure you want to log out of the medical system? This will end your current session.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`px-4 py-2 rounded-md text-white ${
                    isLoggingOut ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  } transition duration-300`}
                >
                  {isLoggingOut ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging out...
                    </div>
                  ) : (
                    'Confirm Logout'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}