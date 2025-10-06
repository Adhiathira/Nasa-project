import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useSearchPapers } from '../hooks/useSearchPapers';
import useAppStore from '../store/useAppStore';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search research papers...",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // API integration hooks
  const { mutate, isPending } = useSearchPapers();
  const { setPapers, setSearchActive, setSearchQuery, setPanelOpen } = useAppStore();

  const handleSearch = () => {
    if (query.trim()) {
      console.log('[SearchBar] Triggering search for query:', query);

      // Clear previous error message
      setErrorMessage(null);

      // Store the query in Zustand
      setSearchQuery(query);

      // Trigger API call
      mutate(query, {
        onSuccess: (papers) => {
          console.log('[SearchBar] Search successful, received papers:', papers.length);
          // Store papers in Zustand
          setPapers(papers);
          // Trigger transition to graph view
          setSearchActive(true);
          // Open the info panel
          setPanelOpen(true);

          // Call optional onSearch callback
          if (onSearch) {
            onSearch(query);
          }
        },
        onError: (error) => {
          console.error('[SearchBar] Search failed:', error);
          setErrorMessage(error.message || 'Search failed. Please try again.');
        }
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isPending) {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main search bar container */}
      <div className="relative flex items-center bg-black/80 backdrop-blur-sm rounded-full border border-blue-500/30 shadow-2xl overflow-hidden" style={{ minHeight: '35px' }}>
        {/* Input field */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isPending}
          className="flex-1 bg-transparent px-12 text-white text-2xl placeholder-gray-400 outline-none focus:placeholder-gray-500 transition-all w-full min-w-[600px] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            caretColor: '#60a5fa',
            height: '35px',
          }}
        />

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={isPending || !query.trim()}
          className="flex items-center justify-center px-6 text-blue-400 hover:text-blue-300 transition-all hover:bg-blue-500/10 active:scale-95 group bg-gray-700 self-stretch disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
          aria-label={isPending ? "Searching..." : "Search"}
        >
          {isPending ? (
            <Loader2
              className="w-6 h-6 animate-spin"
              strokeWidth={2.5}
            />
          ) : (
            <Search
              className="w-6 h-6 group-hover:scale-110 transition-transform"
              strokeWidth={2.5}
            />
          )}
        </button>
      </div>

      {/* Static glow effect */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: '0 0 40px rgba(59,130,246,0.3), 0 0 80px rgba(139,92,246,0.2)',
        }}
      />

      {/* Error message display */}
      {errorMessage && (
        <div className="absolute top-full left-0 right-0 mt-4 px-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm backdrop-blur-sm">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
