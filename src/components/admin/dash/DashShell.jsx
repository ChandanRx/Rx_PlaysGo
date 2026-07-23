"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, BellIcon, ChartPieIcon,
  ClipboardDocumentListIcon, FlagIcon, MagnifyingGlassIcon, MoonIcon, SunIcon, UsersIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";

/* Reference-style admin chrome: a narrow left icon rail and a floating top bar
 * whose centered nav pill drives the same tabs. Everything token-themed. */

export const TABS = ["Overview", "Activity", "Posts", "Users", "Reports"];

const TAB_ICONS = {
  Overview: HomeIcon,
  Activity: ChartPieIcon,
  Posts: ClipboardDocumentListIcon,
  Users: UsersIcon,
  Reports: FlagIcon,
};

const THEME_KEY = "quibly_theme";
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  try { window.localStorage.setItem(THEME_KEY, theme); } catch {}
};

const LogoMark = () => (
  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--text-heading)] shadow-[var(--shadow-sm)]">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 8.5 12 4l7 4.5M5 8.5v7L12 20l7-4.5v-7M5 8.5 12 13l7-4.5M12 13v7"
        stroke="var(--bg-card)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  </div>
);

export const DashSidebar = ({ activeTab, onSelectTab, onBackToApp, onSignOut }) => {
  const [theme, setTheme] = useState("light");
  useEffect(() => { setTheme(document.documentElement.dataset.theme || "light"); }, []);
  const setMode = (mode) => { setTheme(mode); applyTheme(mode); };

  return (
    <aside className="hidden w-[62px] shrink-0 flex-col items-center rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] py-4 shadow-[var(--shadow-sm)] lg:flex">
      <nav className="flex flex-1 flex-col items-center gap-2">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              aria-label={tab}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelectTab(tab)}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                isActive
                  ? "bg-[var(--selected-bg)] text-[var(--selected-fg)] shadow-md"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
              }`}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
            </button>
          );
        })}
      </nav>

      <div className="mt-3 flex flex-col items-center gap-1.5 border-t border-[var(--border-subtle)] pt-3">
        <button
          type="button" aria-label="Light theme" aria-pressed={theme === "light"} onClick={() => setMode("light")}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${theme === "light" ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-faint)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"}`}
        >
          <SunIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button" aria-label="Dark theme" aria-pressed={theme === "dark"} onClick={() => setMode("dark")}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${theme === "dark" ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--text-faint)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"}`}
        >
          <MoonIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button" aria-label="Back to app" title="Back to app" onClick={onBackToApp}
          className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-faint)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
        >
          <ArrowLeftOnRectangleIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
        {onSignOut && (
          <button
            type="button" aria-label="Sign out" title="Sign out" onClick={onSignOut}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-faint)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <ArrowRightOnRectangleIcon className="h-[18px] w-[18px]" strokeWidth={2} />
          </button>
        )}
      </div>
    </aside>
  );
};

export const DashTopBar = ({ activeTab, onSelectTab, session, pendingReports = 0 }) => (
  <header className="flex items-center gap-3">
    <LogoMark />
    <span className="hidden rounded-full bg-[var(--text-heading)] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--bg-card)] sm:inline-block">
      Admin
    </span>

    {/* centered nav pill = tabs */}
    <nav className="mx-auto hidden items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1.5 shadow-[var(--shadow-sm)] md:flex">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelectTab(tab)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              isActive
                ? "bg-[var(--selected-bg)] text-[var(--selected-fg)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </nav>

    <div className="ml-auto flex items-center gap-2.5 md:ml-0">
      <button
        type="button" aria-label="Search"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] shadow-[var(--shadow-sm)] transition hover:text-[var(--text-heading)]"
      >
        <MagnifyingGlassIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
      </button>
      <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pl-1.5 pr-1 shadow-[var(--shadow-sm)]">
        <button
          type="button" aria-label="Notifications"
          onClick={() => onSelectTab("Reports")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
        >
          <BellIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
          {pendingReports > 0 && <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />}
        </button>
        <Image
          src={session?.image || "/placeholder-post.svg"}
          alt={session?.name || "Admin"}
          width={36}
          height={36}
          unoptimized
          className="h-9 w-9 rounded-full object-cover"
        />
      </div>
    </div>
  </header>
);
