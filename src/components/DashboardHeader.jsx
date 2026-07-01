"use client";

import React, { useEffect, useState } from "react";
import { HiBell, HiOutlinePlus, HiSearch } from "react-icons/hi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryModeBadge } from "./CategoryModePrompt";
import { useClientGreeting, useStoredAppCategory } from "../hooks/useClientData";
import { getCategoryLabel } from "../shared/appPreferences";
import Data from "../shared/data";
import { dummyUser } from "../shared/dummyPosts";
import Button from "./ui/Button";

const pageTitles = {
  "/createpost": "Create post",
  "/profile":    "My profile",
  "/settings":   "Settings",
  "/about":      "About",
  "/pro":        "PlaysGo Pro",
};

const searchPlaceholders = {
  Players:      "Search sports, players, matches…",
  "Local Help": "Search tutors, helpers, services…",
  "For Sale":   "Search items, deals, furniture…",
};

const DashboardHeader = () => {
  const pathname     = usePathname();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const { category, hasCategory } = useStoredAppCategory();

  const currentQuery      = searchParams.get("q")      || "";
  const activeFilter      = searchParams.get("filter") || "Nearby";
  const firstName         = dummyUser.name.split(" ")[0];
  const pageTitle         = pageTitles[pathname];
  const greeting          = useClientGreeting();
  const isFeedPage        = pathname === "/" || pathname === "/posts";
  const searchPlaceholder = searchPlaceholders[category] || "Search players, tutors, services…";

  useEffect(() => {
    setSearchValue(currentQuery);
  }, [currentQuery, pathname]);

  const pushWithParams = (params) => {
    const qs   = params.toString();
    const base = pathname === "/" ? "/" : pathname;
    router.push(qs ? `${base}?${qs}` : base);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params  = new URLSearchParams(searchParams.toString());
    const trimmed = searchValue.trim();
    trimmed ? params.set("q", trimmed) : params.delete("q");
    params.delete("category");
    pushWithParams(params);
  };

  const updateFeedParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    !value || value === "All" ? params.delete(key) : params.set(key, value);
    const base = pathname === "/" ? "/" : "/posts";
    const qs   = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
  };

  /* ─────────────────────────────────────
     NON-FEED PAGES — simple title bar
  ───────────────────────────────────── */
  if (pageTitle) {
    return (
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-heading)]">{pageTitle}</h1>
          <p className="text-xs text-[var(--text-muted)]">Manage your local community activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl bg-[#FF7A00] text-sm hover:bg-[#F26A00]"
            onClick={() => router.push("/createpost")}
          >
            <HiOutlinePlus className="text-base" />
            New post
          </Button>
          <BellButton />
        </div>
      </header>
    );
  }

  /* ─────────────────────────────────────
     FEED PAGES
  ───────────────────────────────────── */
  return (
    <header className="mb-4 space-y-2">

      {/* ── Greeting row (very compact) ── */}
      <div className="flex items-center gap-2">
        <h1 className="text-[18px] font-bold text-[var(--text-heading)]">
          {greeting}, {firstName} 👋
        </h1>
        {hasCategory && (
          <span className="hidden text-[12px] text-[var(--text-faint)] lg:inline">
            — {getCategoryLabel(category)} posts near you
          </span>
        )}
        <div className="ml-auto">
          <CategoryModeBadge />
        </div>
      </div>

      {/* ── Single toolbar: filters LEFT · search + bell RIGHT ── */}
      {isFeedPage && hasCategory && (
        <div className="flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">

          {/* LEFT — quick filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {Data.quickFilters.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => updateFeedParam("filter", filter)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors duration-150 ${
                    active
                      ? "bg-[var(--brand)] text-white shadow-[0_2px_8px_rgba(255,122,0,0.3)]"
                      : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--brand-border)] hover:text-[var(--brand)]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* divider */}
          <div className="mx-1 h-5 w-px shrink-0 bg-[var(--border-subtle)]" />

          {/* RIGHT — search form + bell */}
          <div className="ml-auto flex items-center gap-1.5">
            <form
              onSubmit={handleSearchSubmit}
              className="flex shrink-0 items-center gap-1.5"
            >
              <div className="flex h-8 w-[200px] items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 transition-shadow focus-within:border-[var(--brand)] focus-within:bg-[var(--bg-card)] focus-within:shadow-[0_0_0_3px_rgba(255,122,0,0.08)]">
                <HiSearch className="shrink-0 text-[13px] text-[var(--text-faint)]" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-full w-full bg-transparent text-[12px] text-[var(--text-heading)] outline-none placeholder:text-[var(--text-faint)]"
                />
              </div>

              <button
                type="submit"
                className="flex h-8 shrink-0 items-center rounded-full bg-[var(--brand)] px-4 text-[12px] font-semibold text-white shadow-[0_2px_8px_rgba(255,122,0,0.28)] transition-colors hover:bg-[var(--brand-hover)] active:scale-95"
              >
                Search
              </button>
            </form>

            {/* bell */}
            <BellButton />
          </div>
        </div>
      )}
    </header>
  );
};

/* ── Bell button ── */
const BellButton = () => (
  <button
    type="button"
    aria-label="Notifications"
    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--brand-border)] bg-[var(--bg-card)] text-[var(--text-muted)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
  >
    <HiBell className="text-[16px]" />
    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
  </button>
);

export default DashboardHeader;
