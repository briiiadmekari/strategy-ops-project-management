'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_KEY } from '@/constant/auth';
import { LoadingScreen } from '@/components/LoadingScreen';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
