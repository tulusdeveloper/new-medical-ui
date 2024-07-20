"use client"
import React, { ComponentType } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { isAuthenticated } from './api';

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>
): NextPage<P> {
  const WithAuth: NextPage<P> = (props: P) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (mounted && !isAuthenticated()) {
        // Only import and use router on the client side
        const { push } = require('next/router');
        push('/auth/login');
      }
    }, [mounted]);

    // Don't render anything on the server or before mounting
    if (!mounted) {
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };

  // Copy getInitialProps so it will run as well
  if ((WrappedComponent as any).getInitialProps) {
    WithAuth.getInitialProps = (WrappedComponent as any).getInitialProps;
  }

  return WithAuth;
}

export default withAuth;