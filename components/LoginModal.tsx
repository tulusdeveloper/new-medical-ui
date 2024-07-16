// components/LoginModal.jsx
import { useState } from 'react';
import { api } from '@/utils/api';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginModal({ isOpen, onClose }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('token/', { username: usernameOrEmail, password });
      const data = response.data;
      localStorage.setItem('token', data.access);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      onClose();
      window.location.reload(); // Refresh the page to update the app state
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username/email or password');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Session Expired</h3>
        <p className="mb-4">Please log in again to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username-or-email" className="sr-only">
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username or Email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition duration-300">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}