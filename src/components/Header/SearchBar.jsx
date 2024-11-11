// src/components/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    // Fetch the search index
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => {
        const options = {
          keys: ['title', 'content'],
          threshold: 0.3,
        };
        setFuse(new Fuse(data, options));
      })
      .catch((err) => console.error('Error loading search index:', err));
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    if (fuse && value.length > 2) {
      const searchResults = fuse.search(value).slice(0, 5);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md max-h-60">
          {results.map((result, index) => (
            <li key={index} className="px-4 py-2 hover:bg-gray-100">
              <a href={result.item.url}>{result.item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;