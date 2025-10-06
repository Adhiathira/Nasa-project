/**
 * Custom hook for searching research papers
 *
 * Provides a mutation hook for searching papers via the API.
 * Uses TanStack Query's useMutation for state management and caching.
 */

import { useMutation } from '@tanstack/react-query';
import { searchPapers } from '../services/api';
import type { Paper } from '../types/api';

/**
 * Hook for searching research papers
 *
 * Returns a mutation object with methods to trigger the search and access the state.
 *
 * Usage:
 * ```tsx
 * const { mutate, data, isPending, isError, error } = useSearchPapers();
 *
 * const handleSearch = () => {
 *   mutate('photosynthesis');
 * };
 * ```
 *
 * @returns TanStack Query mutation object for searching papers
 */
export function useSearchPapers() {
  const mutation = useMutation<Paper[], Error, string>({
    mutationKey: ['search-papers'],
    mutationFn: (query: string) => {
      console.log('[useSearchPapers] Triggering search mutation with query:', query);
      return searchPapers(query);
    },
    onSuccess: (data) => {
      console.log('[useSearchPapers] Search successful, received papers:', data.length);
    },
    onError: (error) => {
      console.error('[useSearchPapers] Search failed with error:', error);
    },
  });

  return mutation;
}
