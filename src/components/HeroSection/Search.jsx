import React, { useState } from 'react';
import Button from '../ui/Button';
import { Input } from '../ui/FormControls';

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const searchButtonOnClick = () => {
    onSearch(searchText);
  };

  return (
    <div className="mt-8 w-full max-w-xl mx-auto">
      <label
        htmlFor="game-search"
        className="mb-2 text-sm font-medium text-[#89f336] sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-zinc-500"
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
        <Input
          id="game-search"
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search games nearby..."
          className="rounded-full pl-10 pr-24 text-sm shadow-sm"
        />
        <Button
          onClick={searchButtonOnClick}
          className="absolute bottom-1.5 right-1.5"
          size="sm"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;
