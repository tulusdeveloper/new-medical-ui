// utils/withAuth.js
"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [authState, setAuthState] = useState('loading');

    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          Router.push('/auth/login');
        } else {
          setAuthState('authorized');
        }
      };

      checkToken();
    }, [Router]);

    if (authState === 'loading') {
      return null; // or return a loading spinner component
    }

    if (authState === 'authorized') {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;