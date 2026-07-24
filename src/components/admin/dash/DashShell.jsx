"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, BellIcon, ChartBarSquareIcon,
  ChevronDownIcon, ClipboardDocumentListIcon, Cog6ToothIcon, FlagIcon,
  MagnifyingGlassIcon, QuestionMarkCircleIcon, Squares2X2Icon, UsersIcon,
} from "@heroicons/react/24/outline";
import PlaysGoLogo from "../../PlaysGoLogo";
import ThemeToggle from "../../ui/ThemeToggle";

/* Convertex-style admin chrome: a full-width top bar (logo · search · bell ·
 * avatar) and a labeled sidebar with icon + count badges. All token-themed. */

export const TABS = ["Overview", "Activity", "Posts", "Users", "Reports"];

const NAV = [
  { tab: "Overview", label: "Dashboard", icon: Squares2X2Icon },
  { tab: "Activity", label: "Activity", icon: ChartBarSquareIcon },
  { tab: "Posts", label: "Posts", icon: ClipboardDocumentListIcon },
  { tab: "Users", label: "Users", icon: UsersIcon },
  { tab: "Reports", label: "Reports", icon: FlagIcon, badgeKey: "reports" },
];

export const DashTopBar = ({ session }) => (
  <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-5">
    <PlaysGoLogo />

    {/* centered search */}
    <div className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 md:flex">
      <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-[var(--text-faint)]" strokeWidth={2} />
      <input
        type="search"
        placeholder="Search posts, users, reports…"
        className="w-full min-w-0 bg-transparent text-[13px] text-[var(--text-heading)] outline-none placeholder:text-[var(--text-faint)]"
      />
      <kbd className="hidden shrink-0 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--text-faint)] lg:inline-block">⌘K</kbd>
    </div>

    <div className="ml-auto flex items-center gap-2.5">
      <ThemeToggle />
      <button
        type="button" aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] transition hover:text-[var(--text-heading)]"
      >
        <BellIcon className="h-[18px] w-[18px]" strokeWidth={2} />
        <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
      </button>
      <button type="button" className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pl-1 pr-2 transition hover:border-[var(--text-heading)]">
        <Image
          src={session?.image || "/placeholder-post.svg"}
          alt={session?.name || "Admin"}
          width={32} height={32} unoptimized
          className="h-8 w-8 rounded-full object-cover"
        />
        <ChevronDownIcon className="h-4 w-4 text-[var(--text-muted)]" strokeWidth={2.25} />
      </button>
    </div>
  </div>
);

const NavItem = ({ item, active, badge, onSelect }) => {
  const Icon = item.icon;
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(item.tab)}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition ${
        active
          ? "bg-[var(--accent-soft)] text-[var(--text-heading)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
      }`}
    >
      <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-[var(--accent)]" : ""}`} strokeWidth={2} />
      <span className="flex-1 text-left">{item.label}</span>
      {badge > 0 && (
        <span className="rounded-md bg-[var(--bg-secondary)] px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums text-[var(--text-muted)]">
          {String(badge).padStart(2, "0")}
        </span>
      )}
    </button>
  );
};

export const DashSidebar = ({ activeTab, onSelectTab, onBackToApp, onSignOut, pendingReports = 0 }) => (
  <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--border-subtle)] p-4 lg:flex">
    <p className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">General</p>
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <NavItem
          key={item.tab}
          item={item}
          active={activeTab === item.tab}
          badge={item.badgeKey === "reports" ? pendingReports : 0}
          onSelect={onSelectTab}
        />
      ))}
    </nav>

    <p className="mt-6 px-3 pb-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-faint)]">Account</p>
    <nav className="flex flex-col gap-1">
      <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]">
        <Cog6ToothIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} /> Settings
      </button>
      <button type="button" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]">
        <QuestionMarkCircleIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} /> Help &amp; Support
      </button>
      <button type="button" onClick={onBackToApp} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]">
        <ArrowLeftOnRectangleIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} /> Back to app
      </button>
      {onSignOut && (
        <button type="button" onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[var(--text-muted)] transition hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]">
          <ArrowRightOnRectangleIcon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} /> Sign out
        </button>
      )}
    </nav>
  </aside>
);
