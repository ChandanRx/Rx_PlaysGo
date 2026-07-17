"use client";

import React, { useMemo, useRef, useState } from "react";
import { m } from "framer-motion";
import { CheckIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { springSnappy } from "../../shared/motionPresets";
import { DOODLE_AVATARS } from "../../shared/doodleAvatars";

/**
 * Accent backgrounds revealed when an avatar is selected. Warm, editorial
 * tones (coral / orange / yellow / pink / beige) — each avatar gets a stable
 * accent by index so the picker feels intentional rather than random. The
 * illustrations stay monochrome, so every accent reads cleanly behind them in
 * both light and dark mode.
 */
const ACCENTS = [
  "#F59E7D", // coral
  "#F5A94A", // orange
  "#F3C84E", // yellow
  "#EBA9C0", // muted pink
  "#E7D3AC", // beige
  "#D8DCCF", // light gray
];
const accentFor = (index) => ACCENTS[index % ACCENTS.length];

/**
 * `compact` renders a fixed 5-column grid inside a scrollable area — for
 * narrow surfaces like the sign-up form and the edit-profile modal. The
 * default layout is the full-width responsive 4→8 column grid.
 *
 * `gender` ("Male"/"Female", any casing) narrows the set to that presentation
 * plus the neutral avatars; any other value shows everything.
 */
const AvatarPicker = ({ value, onChange, avatars = DOODLE_AVATARS, compact = false, gender = "" }) => {
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const itemRefs = useRef([]);

  const pool = useMemo(() => {
    const key = String(gender).trim().toLowerCase();
    if (key === "male") return avatars.filter((a) => a.gender !== "female");
    if (key === "female") return avatars.filter((a) => a.gender !== "male");
    return avatars;
  }, [avatars, gender]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((a) => a.tags.some((t) => t.includes(q)) || a.id.includes(q));
  }, [pool, query]);

  // Resolve the current column count from the rendered grid itself, so arrow
  // keys move by whatever the layout is actually showing.
  const gridRef = useRef(null);
  const colsAtWidth = () => {
    if (!gridRef.current) return 1;
    return getComputedStyle(gridRef.current).gridTemplateColumns.split(" ").length || 1;
  };

  const focusItem = (i) => {
    const clamped = Math.max(0, Math.min(filtered.length - 1, i));
    setFocusIndex(clamped);
    itemRefs.current[clamped]?.focus();
  };

  const handleKeyDown = (e, index) => {
    const cols = colsAtWidth();
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusItem(index + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusItem(index - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        focusItem(index + cols);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(index - cols);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(filtered.length - 1);
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        onChange?.(filtered[index]);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Search / filter */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusIndex(0);
          }}
          placeholder="Search avatars — glasses, afro, hat, beard…"
          aria-label="Search avatars"
          className="w-full rounded-xl border-0 bg-[var(--bg-secondary)] py-2.5 pl-10 pr-10 text-[13.5px] text-[var(--text-heading)] outline-none transition placeholder:text-[var(--text-faint)] focus:bg-[var(--bg-card)] focus:shadow-[0_0_0_2px_var(--brand)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] transition hover:text-[var(--text-heading)]"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-[var(--text-muted)]">
          No avatars match “{query}”.
        </p>
      ) : (
        <div
          ref={gridRef}
          role="radiogroup"
          aria-label="Choose an avatar"
          className={
            compact
              ? "grid max-h-[264px] grid-cols-5 gap-2 overflow-y-auto p-1.5"
              : "grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-2.5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8"
          }
        >
          {filtered.map((avatar, index) => {
            const selected = value === avatar.url;
            const accent = accentFor(index);
            return (
              <m.button
                key={avatar.id}
                ref={(el) => (itemRefs.current[index] = el)}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={`Avatar: ${avatar.tags.slice(0, 3).join(", ")}`}
                tabIndex={focusIndex === index ? 0 : -1}
                onClick={() => onChange?.(avatar)}
                onFocus={() => setFocusIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                animate={{ scale: selected ? 1.05 : 1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: selected ? 1.0 : 0.96 }}
                transition={springSnappy}
                style={selected ? { backgroundColor: accent } : undefined}
                className={`group relative aspect-square rounded-[18px] p-1.5 outline-none transition-[background-color,box-shadow] duration-200 transform-gpu will-change-transform focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)] ${
                  selected
                    ? "shadow-[0_10px_28px_rgba(28,32,18,0.16)]"
                    : "bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--brand-border)] hover:shadow-[0_10px_28px_rgba(28,32,18,0.12)]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatar.url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full select-none"
                />

                {/* Checkmark indicator in the corner when selected */}
                {selected && (
                  <m.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springSnappy}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--text-heading)] shadow-[0_2px_6px_rgba(28,32,18,0.3)] ring-2 ring-[var(--bg-card)]"
                  >
                    <CheckIcon className="h-3 w-3 text-[var(--bg-card)]" strokeWidth={3} />
                  </m.span>
                )}
              </m.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvatarPicker;
