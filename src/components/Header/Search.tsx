/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import type { FunctionalComponent } from 'preact';

const Search: FunctionalComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const handleInput = (event: Event) => {
    setSearchTerm((event.target as HTMLInputElement).value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={searchTerm}
        onInput={handleInput}
        placeholder="Search..."
        className="w-full px-4 py-2 pr-10 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </form>
  );
};

export default Search;