import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

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

  const handleSearch = () => {
    if (query.trim()) {
      console.log('Search query:', query);
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
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
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-12 text-white text-2xl placeholder-gray-400 outline-none focus:placeholder-gray-500 transition-all w-full min-w-[600px]"
          style={{
            caretColor: '#60a5fa',
            height: '35px',
          }}
        />

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center px-6 text-blue-400 hover:text-blue-300 transition-all hover:bg-blue-500/10 active:scale-95 group bg-gray-700 self-stretch"
          aria-label="Search"
        >
          <Search
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Static glow effect */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: '0 0 40px rgba(59,130,246,0.3), 0 0 80px rgba(139,92,246,0.2)',
        }}
      />
    </div>
  );
};

export default SearchBar;
