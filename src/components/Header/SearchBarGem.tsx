import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

interface Document {
  id: string;
  title: string;
  content: string;
  url: string;
}

const SearchBarGem = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [fuse, setFuse] = useState<Fuse<Document> | null>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((response) => response.json())
      .then((data: { documents: Document[] }) => {
        const fuseInstance = new Fuse(data.documents, {
          keys: ['title', 'content'],
          includeScore: true,
        });
        setFuse(fuseInstance);
      });
  }, []);

  const handleSearch = (event: any) => {
    const inputQuery = event.target.value;
    setQuery(inputQuery);
    if (fuse && inputQuery) {
      const searchResults = fuse.search(inputQuery);
      setResults(searchResults.map((result) => result.item));
    } else {
      setResults([]);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search..."
          className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {results.slice(0, 10).map((result) => (
            <li key={result.id} className="px-4 py-2">
              <a href={result.url} className="hover:underline">
                {result.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarGem;
