"use client";

import React, { useEffect, useRef, useState } from "react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { CheckIcon, ChevronDownIcon, Cog6ToothIcon, HandRaisedIcon, PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, m } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryModeBadge } from "./CategoryModePrompt";
import { useAuthSession, useClientGreeting, useNotifications, useStoredAppCategory } from "../hooks/useClientData";
import { getCategoryLabel } from "../shared/appPreferences";
import { markAllNotificationsRead, markNotificationRead } from "../shared/notifications";
import Data from "../shared/data";
import { popIn, springSnappy } from "../shared/motionPresets";
import Button from "./ui/Button";

// "/dashboard" is absent on purpose — the admin console renders standalone
// (src/app/dashboard/layout.js), outside AppShell and this header.
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
  const { session, isReady: authReady } = useAuthSession();

  const currentQuery      = searchParams.get("q")      || "";
  const activeFilter      = searchParams.get("filter") || "Nearby";
  const activeSport       = searchParams.get("sport")  || "";
  const sportOptions      = Data.subCategoryMap.Players;
  const firstName         = (session?.name || "Guest").split(" ")[0];
  const showSignIn        = authReady && !session;
  // Someone else's profile (/profile/[username]) is still a titled page, not a
  // feed — without this it falls through to the feed greeting + search header.
  const isProfileSubpage  = pathname.startsWith("/profile/");
  const pageTitle         = pageTitles[pathname] || (isProfileSubpage ? "Profile" : undefined);
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
          {showSignIn && (
            <Button variant="secondary" size="sm" onClick={() => router.push("/signin")}>
              Sign in
            </Button>
          )}
          {/* Brand CTA variant — overriding "primary" with bg classes was an
              order-dependent conflict that left the white solid pill in dark.
              Hidden on /createpost — you're already there. */}
          {pathname !== "/createpost" && (
            <Button
              variant="yellow"
              size="sm"
              onClick={() => router.push("/createpost")}
            >
              <PlusIcon className="h-4 w-4" />
              New post
            </Button>
          )}
          <NotificationBell variant="desktop" />
        </div>
      </header>
    );
  }

  /* ─────────────────────────────────────
     FEED PAGES
  ───────────────────────────────────── */
  return (
    <header className="mb-4">

      {/* ═══════════════════════════════════
          MOBILE — redesigned from scratch
          (hidden at lg and above)
      ═══════════════════════════════════ */}
      <div className="space-y-4 pb-1 pt-1 lg:hidden">

        {/* Row 1 — compact greeting + sports selector */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[13px] font-medium text-[var(--text-muted)]">
              {greeting} <span aria-hidden="true">👋</span>
            </p>
            <h1 className="truncate text-[22px] font-extrabold leading-tight tracking-tight text-[var(--text-heading)]">
              {firstName}
            </h1>
          </div>
          {showSignIn ? (
            <Button variant="primary" size="sm" onClick={() => router.push("/signin")}>
              Sign in
            </Button>
          ) : (
            <MobileSettingsButton onClick={() => router.push("/settings")} />
          )}
        </div>

        {/* Row 2 — search + notification, side by side */}
        {isFeedPage && hasCategory && (
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="min-w-0 flex-1">
              <div className="flex h-12 items-center gap-2.5 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md bg-[var(--bg-input)] px-4 shadow-[0_4px_18px_rgba(28,32,18,0.07)] transition-shadow duration-200 focus-within:shadow-[0_4px_20px_rgba(var(--brand-rgb),0.16)]">
                <MagnifyingGlassIcon className="shrink-0 h-[17px] w-[17px] text-[var(--text-faint)]" />
                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-full w-full bg-transparent text-[14px] text-[var(--text-heading)] outline-none focus-visible:shadow-none placeholder:text-[var(--text-faint)]"
                />
              </div>
            </form>
            <NotificationBell variant="mobile" />
          </div>
        )}

        {/* Row 3 — filter chips + sport dropdown.
            The scrolling pills stay in their own overflow-x container; the
            dropdown sits outside it so its menu isn't clipped by overflow-y. */}
        {isFeedPage && hasCategory && (
          <div className="-mx-4 flex items-center gap-2 px-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {Data.quickFilters.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => updateFeedParam("filter", filter)}
                    className="relative shrink-0 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md px-4 py-2 text-[13px] font-semibold transition-transform duration-150 active:scale-95"
                  >
                    {active ? (
                      <m.span
                        layoutId="filter-chip-active-pill"
                        transition={springSnappy}
                        className="absolute inset-0 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md bg-[linear-gradient(var(--btn-grad-angle),var(--btn-grad-from),var(--btn-grad-to))] shadow-[0_4px_12px_rgba(var(--btn-grad-shadow),0.30)]"
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-[var(--border-subtle)] bg-[var(--bg-card)]" />
                    )}
                    <span className={`relative z-10 ${active ? "text-[var(--btn-grad-fg)]" : "text-[var(--text-muted)]"}`}>
                      {filter}
                    </span>
                  </button>
                );
              })}
            </div>
            <SportsFilterDropdown
              sports={sportOptions}
              value={activeSport}
              onChange={(sport) => updateFeedParam("sport", sport)}
              size="mobile"
            />
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          DESKTOP — unchanged
      ═══════════════════════════════════ */}
      <div className="hidden space-y-2 lg:block">

        {/* ── Greeting row (very compact) ── */}
        <div className="flex items-center gap-2">
          <h1 className="text-[18px] font-bold text-[var(--text-heading)]">
            <span className="inline-flex items-center gap-1.5">
              {greeting}, {firstName}
              <HandRaisedIcon className="h-4 w-4 text-[var(--brand)]" strokeWidth={2.25} />
            </span>
          </h1>
          {hasCategory && (
            <span className="hidden text-[12px] text-[var(--text-faint)] lg:inline">
              — {getCategoryLabel(category)} posts near you
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {showSignIn && (
              <Button variant="secondary" size="sm" onClick={() => router.push("/signin")}>
                Sign in
              </Button>
            )}
            <CategoryModeBadge />
          </div>
        </div>

        {/* ── Single toolbar: filters LEFT · search + bell RIGHT ── */}
        {isFeedPage && hasCategory && (
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 shadow-[0_2px_10px_rgba(28,32,18,0.05)]">

            {/* LEFT — quick filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {Data.quickFilters.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <Button
                    key={filter}
                    variant={active ? "yellow" : "secondary"}
                    size="sm"
                    onClick={() => updateFeedParam("filter", filter)}
                    className="shrink-0"
                  >
                    {filter}
                  </Button>
                );
              })}
            </div>

            {/* sport filter dropdown */}
            <SportsFilterDropdown
              sports={sportOptions}
              value={activeSport}
              onChange={(sport) => updateFeedParam("sport", sport)}
              size="desktop"
            />

            {/* divider */}
            <div className="mx-1 h-5 w-px shrink-0 bg-[var(--border-subtle)]" />

            {/* RIGHT — search form + bell */}
            <div className="ml-auto flex items-center gap-1.5">
              <form
                onSubmit={handleSearchSubmit}
                className="flex shrink-0 items-center gap-1.5"
              >
                <div className="flex h-8 w-[200px] items-center gap-2 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 transition-shadow focus-within:border-[var(--brand)] focus-within:bg-[var(--bg-card)] focus-within:shadow-[0_0_0_3px_rgba(var(--brand-rgb),0.08)]">
                  <MagnifyingGlassIcon className="shrink-0 h-[13px] w-[13px] text-[var(--text-faint)]" />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-full w-full bg-transparent text-[12px] text-[var(--text-heading)] outline-none focus-visible:shadow-none placeholder:text-[var(--text-faint)]"
                  />
                </div>

                <Button type="submit" variant="yellow" size="sm" className="shrink-0">
                  Search
                </Button>
              </form>

              {/* bell */}
              <NotificationBell variant="desktop" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

/* ── Notification bell — real unread count + click-to-open dropdown ── */
const NotificationBell = ({ variant = "desktop" }) => {
  const router = useRouter();
  const { notifications, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isMobile = variant === "mobile";

  useEffect(() => {
    if (!open) return;
    const handleClickAway = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", handleClickAway);
    return () => window.removeEventListener("mousedown", handleClickAway);
  }, [open]);

  const handleSelect = (notification) => {
    markNotificationRead(notification.id);
    setOpen(false);
    if (notification.href) router.push(notification.href);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className={
          isMobile
            ? "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md bg-[var(--bg-input)] text-[var(--text-muted)] shadow-[0_4px_18px_rgba(28,32,18,0.07)] transition active:scale-95"
            : "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-[var(--brand-border)] bg-[var(--bg-card)] text-[var(--text-muted)] transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
        }
      >
        <BellIcon className={isMobile ? "h-[19px] w-[19px]" : "h-4 w-4"} />
        {unreadCount > 0 && (
          isMobile ? (
            <span className="absolute right-3 top-3 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand)]" />
            </span>
          ) : (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
          )
        )}
      </button>

      <AnimatePresence>
        {open && (
        <m.div
          {...popIn}
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 shadow-[0_12px_32px_rgba(28,32,18,0.14)]"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-[12px] font-bold text-[var(--text-heading)]">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead()}
                className="text-[11px] font-semibold text-[var(--brand)] transition hover:text-[var(--brand-hover)]"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-2 py-4 text-center text-[12.5px] text-[var(--text-muted)]">No notifications yet</p>
          ) : (
            <ul className="max-h-72 space-y-0.5 overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(notification)}
                    className={`flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-[var(--bg-input)] ${
                      !notification.read ? "bg-[var(--brand-soft)]/40" : ""
                    }`}
                  >
                    {!notification.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />}
                    <span className={`min-w-0 flex-1 ${notification.read ? "pl-3.5" : ""}`}>
                      <span className="block truncate text-[12.5px] text-[var(--text-body)]">{notification.title}</span>
                      <span className="mt-0.5 block text-[10.5px] text-[var(--text-faint)]">{notification.time}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Sport filter — pill-styled dropdown that filters the feed by game ──
   Options come from the same list the create-post form uses
   (Data.subCategoryMap.Players), and "All sports" clears the filter. ── */
const SportsFilterDropdown = ({ sports = [], value = "", onChange, size = "desktop" }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isMobile = size === "mobile";
  const active = Boolean(value);

  useEffect(() => {
    if (!open) return;
    const handleClickAway = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", handleClickAway);
    return () => window.removeEventListener("mousedown", handleClickAway);
  }, [open]);

  const select = (sport) => {
    onChange?.(sport);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <Button
        variant={active ? "yellow" : "secondary"}
        size={isMobile ? "md" : "sm"}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="gap-1"
      >
        {value || "Sport"}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
        />
      </Button>

      <AnimatePresence>
        {open && (
          <m.div
            {...popIn}
            role="listbox"
            aria-label="Filter by sport"
            className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1.5 shadow-[0_12px_32px_rgba(28,32,18,0.14)]"
          >
            {["", ...sports].map((sport) => {
              const selected = value === sport;
              return (
                <button
                  key={sport || "all"}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => select(sport)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[12.5px] font-semibold transition ${
                    selected
                      ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-heading)]"
                  }`}
                >
                  {sport || "All sports"}
                  {selected && <CheckIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Mobile settings shortcut — compact gear button, top-right of the header ── */
const MobileSettingsButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Settings"
    title="Settings"
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md bg-[var(--bg-card)] text-[var(--text-muted)] shadow-[0_4px_14px_rgba(28,32,18,0.08)] transition active:scale-95 hover:text-[var(--brand)]"
  >
    <Cog6ToothIcon className="h-[19px] w-[19px]" strokeWidth={2} />
  </button>
);

export default DashboardHeader;
