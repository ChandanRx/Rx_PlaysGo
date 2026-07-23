"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarDaysIcon, ChartPieIcon, Cog6ToothIcon, EnvelopeIcon, FolderIcon,
  MoonIcon, SunIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";

/* Left icon rail — a tall narrow column mirroring the reference: nav icons up
 * top (active = filled dark square), sun/moon theme switches pinned to the
 * bottom. Everything token-themed. */
const NAV = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "stats", label: "Insights", icon: ChartPieIcon },
  { id: "calendar", label: "Calendar", icon: CalendarDaysIcon },
  { id: "files", label: "Library", icon: FolderIcon },
  { id: "inbox", label: "Inbox", icon: EnvelopeIcon },
  { id: "settings", label: "Settings", icon: Cog6ToothIcon },
];

const THEME_KEY = "quibly_theme";

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  try { window.localStorage.setItem(THEME_KEY, theme); } catch {}
};

const LearnSidebar = () => {
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
  }, []);

  const setMode = (mode) => {
    setTheme(mode);
    applyTheme(mode);
  };

  return (
    <aside className="flex w-[62px] shrink-0 flex-col items-center rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] py-4 shadow-[var(--shadow-sm)]">
      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActive(id)}
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

      {/* theme switches */}
      <div className="mt-3 flex flex-col items-center gap-1.5 border-t border-[var(--border-subtle)] pt-3">
        <button
          type="button"
          aria-label="Light theme"
          aria-pressed={theme === "light"}
          onClick={() => setMode("light")}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
            theme === "light"
              ? "bg-[var(--brand-soft)] text-[var(--brand)]"
              : "text-[var(--text-faint)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
          }`}
        >
          <SunIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Dark theme"
          aria-pressed={theme === "dark"}
          onClick={() => setMode("dark")}
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
            theme === "dark"
              ? "bg-[var(--brand-soft)] text-[var(--brand)]"
              : "text-[var(--text-faint)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
          }`}
        >
          <MoonIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
};

export default LearnSidebar;
