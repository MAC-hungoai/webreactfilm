import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Admin Page Wrapper Component
 * Ensures only ADMIN users can access the page
 * Regular users are redirected to home
 */
export function withAdminProtection<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/auth');
        return;
      }

      const userRole = (session?.user as any)?.role;
      if (userRole !== 'ADMIN') {
        router.push('/');
        return;
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
      );
    }

    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN') {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
}

/**
 * Example usage in pages:
 * 
 * export default withAdminProtection(AdminDashboard);
 */
