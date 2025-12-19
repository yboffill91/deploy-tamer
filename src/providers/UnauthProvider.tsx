'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthError } from '@/core';

export function AuthInterceptor({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      if (event.reason instanceof AuthError) {
        router.replace('/sign_in');
      }
    };

    window.addEventListener('unhandledrejection', handler);

    return () => {
      window.removeEventListener('unhandledrejection', handler);
    };
  }, [router]);

  return <>{children}</>;
}
