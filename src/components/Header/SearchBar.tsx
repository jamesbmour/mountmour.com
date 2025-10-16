import React, { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';

interface SearchResult {
  title: string;
  url: string;
  content: string;
  matches?: Fuse.FuseResultMatch[];
}

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Fuse.FuseResult<SearchResult>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchResult[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchResult> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuse.js options
  const fuseOptions: Fuse.IFuseOptions<SearchResult> = {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'content', weight: 0.3 },
    ],
    includeScore: true,
    includeMatches: true,
    threshold: 0.3,
    minMatchCharLength: 2,
    ignoreLocation: true,
  };

  // Load search index on mount
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        setIsLoading(true);
        // Fetch the search index (you'll need to generate this)
        const response = await fetch('/search-index.json');
        const data = await response.json();
        setSearchData(data);
        setFuse(new Fuse(data, fuseOptions));
      } catch (error) {
        console.error('Failed to load search index:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSearchIndex();
  }, []);

  // Handle search
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.slice(0, 8)); // Limit to 8 results
    setIsOpen(searchResults.length > 0);
  }, [query, fuse]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Highlight matched text
  const highlightMatch = (text: string, matches?: readonly Fuse.RangeTuple[]): React.ReactNode => {
    if (!matches || matches.length === 0) {
      return text;
    }

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach(([start, end]) => {
      // Add text before match
      if (start > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`}>{text.slice(lastIndex, start)}</span>
        );
      }
      // Add highlighted match
      result.push(
        <mark
          key={`mark-${start}`}
          className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-gray-100 px-0.5 rounded"
        >
          {text.slice(start, end + 1)}
        </mark>
      );
      lastIndex = end + 1;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return result;
  };

  // Handle result click
  const handleResultClick = (url: string) => {
    window.location.href = url;
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
          placeholder="Search the site..."
          className="w-full md:w-64 pl-10 pr-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className="absolute z-50 w-full md:w-96 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
          role="listbox"
        >
          <div className="p-2 text-xs text-gray-400 border-b border-gray-700">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
          {results.map((result, index) => {
            const titleMatch = result.matches?.find((m) => m.key === 'title');
            const contentMatch = result.matches?.find((m) => m.key === 'content');

            return (
              <button
                key={`${result.item.url}-${index}`}
                onClick={() => handleResultClick(result.item.url)}
                className="w-full text-left p-3 hover:bg-gray-700 transition-colors duration-150 border-b border-gray-700 last:border-b-0 focus:outline-none focus:bg-gray-700"
                role="option"
                aria-selected="false"
              >
                <div className="font-medium text-white text-sm mb-1">
                  {titleMatch
                    ? highlightMatch(result.item.title, titleMatch.indices)
                    : result.item.title}
                </div>
                {contentMatch && (
                  <div className="text-xs text-gray-400 line-clamp-2">
                    {highlightMatch(
                      result.item.content.slice(0, 150) + '...',
                      contentMatch.indices
                    )}
                  </div>
                )}
                <div className="text-xs text-blue-400 mt-1">{result.item.url}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute z-50 w-full md:w-96 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400">
          Loading search index...
        </div>
      )}

      {/* No Results */}
      {query && !isLoading && results.length === 0 && fuse && (
        <div className="absolute z-50 w-full md:w-96 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 text-center text-gray-400">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
