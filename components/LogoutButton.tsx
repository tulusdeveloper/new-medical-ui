"use client"
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/api';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/auth/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      <FaSignOutAlt className="mr-2" />
      Logout
    </button>
  );
}