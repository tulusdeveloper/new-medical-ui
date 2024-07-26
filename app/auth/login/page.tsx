"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { motion } from 'framer-motion';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const response = await api.post('token/', { username: usernameOrEmail, password });
      const data = response.data;
      localStorage.setItem('token', data.access);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/home/dashboard');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username/email or password');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsernameOrEmail(storedUsername);
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-400 via-teal-500 to-green-500">
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{backgroundImage: "url('/login2.webp')"}}></div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
        >
          <div className="text-center">
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your MedXpert dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="username-or-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username-or-email"
                    name="username-or-email"
                    type="text"
                    autoComplete="username email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                    placeholder="Enter your username or email"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 focus:outline-none"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="stay-signed-in"
                  name="stay-signed-in"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                />
                <label htmlFor="stay-signed-in" className="ml-2 block text-sm text-gray-900">
                  Stay signed in
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-teal-600 hover:text-teal-500 transition duration-300 ease-in-out">
                  Forgot your password?
                </Link>
              </div>
            </div>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-teal-600 hover:text-teal-500 transition duration-300 ease-in-out">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}