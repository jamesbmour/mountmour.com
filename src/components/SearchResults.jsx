import React, { useState, useEffect } from 'react';
import lunr from 'lunr';

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchIndex, setSearchIndex] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Load search index on mount
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const response = await fetch('/search-index.json');
        if (!response.ok) {
          throw new Error('Failed to load search index');
        }
        const data = await response.json();
        setSearchIndex(lunr.Index.load(data.index));
        setDocuments(data.documents);
        setLoading(false);
      } catch (err) {
        console.error('Error loading search index:', err);
        setError('Failed to load search index. Please try again later.');
        setLoading(false);
      }
    };

    loadSearchIndex();
  }, []);

  // Get query from URL and perform search
  useEffect(() => {
    if (typeof window === 'undefined' || !searchIndex || documents.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    setQuery(searchQuery);

    if (searchQuery.trim() && searchIndex) {
      try {
        // Use wildcard search for better results
        const searchTerm = searchQuery.trim();
        let searchResults = [];
        
        try {
          // Try exact search first
          searchResults = searchIndex.search(searchTerm);
        } catch {
          // If exact search fails, try with wildcard
          try {
            searchResults = searchIndex.search(`${searchTerm}*`);
          } catch {
            // If that fails too, try fuzzy search
            searchResults = searchIndex.search(`${searchTerm}~1`);
          }
        }
        
        const matchedDocs = searchResults
          .map(result => {
            const doc = documents.find(d => d.id === result.ref);
            return doc ? {
              ...doc,
              score: result.score,
            } : null;
          })
          .filter(Boolean);
          
        setResults(matchedDocs);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  }, [query, searchIndex, documents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading search index...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Search Results</h1>
        {query && (
          <p className="text-gray-400">
            {results.length > 0 ? (
              <>
                Found <span className="font-semibold text-white">{results.length}</span> result
                {results.length !== 1 ? 's' : ''} for "<span className="font-semibold text-white">{query}</span>"
              </>
            ) : (
              <>
                No results found for "<span className="font-semibold text-white">{query}</span>"
              </>
            )}
          </p>
        )}
        {!query && (
          <p className="text-gray-400">
            Enter a search query to find documentation.
          </p>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((result, index) => (
            <article
              key={result.id || index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
            >
              <a href={result.url} className="block group">
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {result.title}
                </h2>
                {result.description && (
                  <p className="text-gray-300 mb-3">{result.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-400">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="group-hover:text-blue-400 transition-colors">
                    {result.url}
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search query or browse the documentation using the sidebar.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
