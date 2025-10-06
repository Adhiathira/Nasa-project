/**
 * Test API Page Component
 *
 * This page provides a simple UI to test the search API integration.
 * Users can enter a query, trigger the search, and view the formatted JSON response.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchPapers } from '../hooks/useSearchPapers';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';

export default function TestApiPage() {
  const [query, setQuery] = useState('');
  const { mutate, data, isPending, isError, error } = useSearchPapers();

  const handleSearch = () => {
    if (query.trim()) {
      console.log('[TestApiPage] Initiating search with query:', query);
      mutate(query.trim());
    } else {
      console.warn('[TestApiPage] Empty query, search not triggered');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-gray-700" />
            <h1 className="text-xl font-semibold">API Test Page</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Test Search API</h2>
            <p className="text-gray-400">
              Enter a search query to test the backend API integration. This page demonstrates
              the search functionality using TanStack Query and the FastAPI backend.
            </p>
          </div>

          {/* Search Input */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter search query (e.g., photosynthesis, quantum computing, climate change)"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isPending}
              />
              <button
                onClick={handleSearch}
                disabled={isPending || !query.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {isPending && (
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400">Fetching research papers from the API...</p>
              </div>
            )}

            {isError && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-semibold">Error occurred:</p>
                <p className="text-red-300 mt-1">{error?.message || 'Unknown error'}</p>
              </div>
            )}
          </div>

          {/* Response Display */}
          {data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">API Response</h3>
                <span className="text-sm text-gray-400">
                  {data.length} {data.length === 1 ? 'paper' : 'papers'} found
                </span>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4">
                {data.slice(0, 3).map((paper, index) => (
                  <div
                    key={paper.paper_id}
                    className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-gray-500">#{index + 1}</span>
                          <h4 className="font-semibold text-white">{paper.metadata.title}</h4>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {paper.metadata.summary}
                        </p>
                        <p className="text-xs font-mono text-gray-500">
                          ID: {paper.paper_id}
                        </p>
                      </div>
                      <div className="flex-shrink-0 px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-md">
                        <span className="text-sm font-mono text-blue-400">
                          {(paper.similarity * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full JSON Response */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                  Full JSON Response
                </h4>
                <div className="relative">
                  <pre className="p-4 bg-gray-950 border border-gray-800 rounded-lg overflow-x-auto text-xs text-gray-300 font-mono max-h-96 overflow-y-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!data && !isPending && !isError && (
            <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">How to use:</h3>
              <ol className="space-y-2 text-gray-400">
                <li className="flex gap-3">
                  <span className="text-blue-400 font-semibold">1.</span>
                  <span>Enter a search query in the input field above</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-semibold">2.</span>
                  <span>Click the "Search" button or press Enter</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-semibold">3.</span>
                  <span>View the response with paper titles, summaries, and similarity scores</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 font-semibold">4.</span>
                  <span>Check the browser console for detailed API logs</span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
