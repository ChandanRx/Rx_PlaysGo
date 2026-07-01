import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Input } from "../ui/FormControls";
import Data from "../../shared/data";

const Search = ({
  onSearch,
  onFilterChange,
  activeFilter,
  eyebrow = "",
  title = "",
  description = "",
  placeholder = "Search cricket, tutors, jobs, events, services...",
  inputId = "playsgo-search",
  action = null,
  showFilters = true,
  centered = false,
}) => {
  const [searchText, setSearchText] = useState("");

  const hasHeaderContent = Boolean(eyebrow || title || description);

  const searchButtonOnClick = () => {
    onSearch(searchText);
  };

  return (
    <Card
      className={`mx-auto w-full p-4 md:p-5 ${centered ? "max-w-3xl" : "max-w-8xl"}`}
    >
      <div className="flex flex-col gap-4">
        {hasHeaderContent && (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            {(eyebrow || title) && (
              <div>
                {eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f1838]">
                    {eyebrow}
                  </p>
                )}
                {title && (
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950 md:text-2xl">
                    {title}
                  </h2>
                )}
              </div>
            )}

            {(description || action) && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:max-w-xl">
                {description && (
                  <p className="text-sm text-zinc-600">{description}</p>
                )}
                {action}
              </div>
            )}
          </div>
        )}

        <div
          className={`flex gap-3 ${hasHeaderContent ? "flex-col" : centered ? "justify-center" : "flex-col sm:flex-row sm:items-center"}`}
        >
          <div className={`relative ${centered ? "w-full" : "flex-1"}`}>
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
              id={inputId}
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={placeholder}
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

          {!hasHeaderContent && action && (
            <div className="shrink-0">{action}</div>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {Data.quickFilters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onFilterChange(filter)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#8f1838] bg-[#8f1838] text-[#ffffff]"
                      : "border-[#8f1838]/25 bg-[#f7e5eb]/76 text-zinc-700 hover:border-[#8f1838]/45 hover:bg-[#fff7f9]/92"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Search;
