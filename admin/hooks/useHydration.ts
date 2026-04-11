import { useEffect, useState } from 'react';

/**
 * Hook to prevent hydration errors
 * Ensures content only renders on client after hydration is complete
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Wrapper component to safely render client-only content
 */
export function ClientOnly({ children }: { children: React.ReactNode }): JSX.Element | null {
  const isHydrated = useHydration();
  return isHydrated ? <>{children}</> : null;
}
