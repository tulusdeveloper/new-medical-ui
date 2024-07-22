"use client"

import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from './api';

const spinnerStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '50px',
  height: '50px',
  border: '3px solid rgba(0, 0, 0, 0.3)',
  borderRadius: '50%',
  borderTop: '3px solid #007bff',
  animation: 'spin 1s linear infinite',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        if (!await isAuthenticated()) {
          router.push('/auth/login');
        } else {
          setIsChecking(false);
        }
      };

      checkAuth();
    }, [router]);

    useEffect(() => {
      // Add keyframes to the document
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }, []);

    if (isChecking) {
      return React.createElement('div', { style: containerStyle },
        React.createElement('div', { style: spinnerStyle })
      );
    }

    return React.createElement(WrappedComponent, props);
  };
}

export default withAuth;