/**
 * TanStack Query provider component
 *
 * Wraps the application with QueryClientProvider to enable React Query functionality
 * throughout the component tree. Configures default options for queries and mutations.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

/**
 * Create QueryClient instance with default configuration
 *
 * Default settings:
 * - retry: 3 attempts on failure
 * - staleTime: 5 minutes (300000ms)
 * - refetchOnWindowFocus: false (avoid unnecessary refetches)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

console.log('[QueryProvider] QueryClient initialized with default options');

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider component
 *
 * Wraps children with QueryClientProvider to enable TanStack Query functionality.
 * Should be placed near the root of the application component tree.
 *
 * @param props - Component props
 * @param props.children - Child components to wrap
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
