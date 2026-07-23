"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getGenderAvatar } from "../../shared/doodleAvatars";

/* Floating top bar (no surrounding card, like the reference): a standalone
 * logo mark, a centered white nav pill, and a search circle + a pill holding
 * the bell and avatar. */
const NAV = ["Dashboard", "Speaking", "Progress", "Courses"];

const LogoMark = () => (
  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--text-heading)] shadow-[var(--shadow-sm)]">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 8.5 12 4l7 4.5M5 8.5v7L12 20l7-4.5v-7M5 8.5 12 13l7-4.5M12 13v7"
        stroke="var(--bg-card)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const LearnTopBar = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <header className="flex items-center gap-3">
      <LogoMark />

      {/* centered nav pill */}
      <nav className="mx-auto hidden items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1.5 shadow-[var(--shadow-sm)] md:flex">
        {NAV.map((item) => {
          const isActive = active === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setActive(item)}
              className={`rounded-full px-5 py-2 text-[13px] font-semibold transition ${
                isActive
                  ? "bg-[var(--selected-bg)] text-[var(--selected-fg)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </nav>

      {/* right cluster */}
      <div className="ml-auto flex items-center gap-2.5 md:ml-0">
        <button
          type="button"
          aria-label="Search"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] shadow-[var(--shadow-sm)] transition hover:text-[var(--text-heading)]"
        >
          <MagnifyingGlassIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </button>

        <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1 pl-1.5 pr-1 shadow-[var(--shadow-sm)]">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
          >
            <BellIcon className="h-[18px] w-[18px]" strokeWidth={2.25} />
            <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
          </button>
          <Image
            src={getGenderAvatar("female", 4)}
            alt="Your avatar"
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default LearnTopBar;
