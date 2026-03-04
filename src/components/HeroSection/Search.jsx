import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const searchButtonOnClick = () => {
    onSearch(searchText);
  };

  return (
    <div className="mt-8 w-full max-w-xl mx-auto">
      <label
        htmlFor="game-search"
        className="mb-2 text-sm font-medium text-yellow-400 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
            />
          </svg>
        </div>
        <input
          id="game-search"
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search games nearby..."
          className="w-full rounded-full border border-white/10 bg-black/40 p-3 pl-10 text-sm text-slate-50 placeholder-slate-400 shadow-sm outline-none transition focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/30"
        />
        <button
          onClick={searchButtonOnClick}
          type="button"
          className="absolute bottom-1.5 right-1.5 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-amber-300"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
