import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

/**
 * Hook to check if current user is admin
 * Returns { isAdmin, isLoading, isError }
 */
export function useAdminRole() {
  const { data: session, status } = useSession();
  
  const isAdmin = useMemo(() => {
    if (status !== 'authenticated' || !session) return false;
    return (session.user as any)?.role === 'ADMIN';
  }, [session, status]);

  return {
    isAdmin,
    isLoading: status === 'loading',
    isError: status === 'unauthenticated',
    userRole: (session?.user as any)?.role || 'USER',
  };
}

/**
 * Hook to check if current user is authenticated
 */
export function useIsAuthenticated() {
  const { data: session, status } = useSession();
  
  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user,
    userRole: (session?.user as any)?.role || 'USER',
  };
}

/**
 * Hook to ensure user has admin role
 * Redirects to home if not admin
 */
export function useRequireAdmin() {
  const router = require('next/router').useRouter();
  const { isAdmin, isLoading } = useAdminRole();

  if (!isLoading && !isAdmin) {
    router.push('/');
  }

  return { isAdmin, isLoading };
}
