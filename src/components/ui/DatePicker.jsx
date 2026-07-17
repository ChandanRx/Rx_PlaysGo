"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { popIn } from "../../shared/motionPresets";
import { fieldBaseClass } from "./FormControls";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n) => String(n).padStart(2, "0");

// value is stored as ISO `yyyy-mm-dd` (native <input type="date"> format).
const toISO = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseISO = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDisplay = (str) => {
  const date = parseISO(str);
  if (!date) return "";
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

const isSameDay = (a, b) =>
  a && b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Days rendered in a 6-week grid, Monday-first (matches the app calendar layout).
const buildGrid = (viewYear, viewMonth) => {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // JS: 0=Sun … 6=Sat. Convert to Monday-first offset.
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(viewYear, viewMonth, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { date, inMonth: date.getMonth() === viewMonth };
  });
};

const DatePicker = ({ name, value = "", onChange, className = "", disabled = false }) => {
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const selected = useMemo(() => parseISO(value), [value]);
  const today = useMemo(() => new Date(), []);

  // Month/year currently shown in the grid.
  const [view, setView] = useState(() => {
    const base = parseISO(value) || new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  // When the popover opens, jump the view to the selected date (or today).
  useEffect(() => {
    if (isOpen) {
      const base = parseISO(value) || new Date();
      setView({ year: base.getFullYear(), month: base.getMonth() });
    }
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const emit = (nextValue) => {
    onChange?.({ target: { name, value: nextValue, type: "date" } });
  };

  const selectDate = (date) => {
    emit(toISO(date));
    setIsOpen(false);
  };

  const shiftMonth = (delta) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const grid = useMemo(() => buildGrid(view.year, view.month), [view]);

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      {/* trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`${fieldBaseClass} flex items-center justify-between gap-2 pr-10 text-left ${
          selected ? "text-[var(--text-heading)]" : "text-[var(--text-faint)]"
        }`}
      >
        {selected ? formatDisplay(value) : "dd-mm-yyyy"}
      </button>
      <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />

      <AnimatePresence>
        {isOpen && (
          <m.div
            {...popIn}
            role="dialog"
            aria-label="Choose date"
            className="absolute left-0 z-50 mt-2 w-[288px] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3.5 shadow-[0_12px_32px_rgba(28,32,18,0.14)]"
          >
            {/* header */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-bold text-[var(--text-heading)]">
                {MONTHS[view.month]} {view.year}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
                >
                  <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--bg-hover)] hover:text-[var(--text-heading)]"
                >
                  <ChevronRightIcon className="h-4 w-4" strokeWidth={2.25} />
                </button>
              </div>
            </div>

            {/* weekday row */}
            <div className="mb-1 grid grid-cols-7 gap-0.5">
              {WEEKDAYS.map((d) => (
                <div key={d} className="flex h-8 items-center justify-center text-[11.5px] font-semibold text-[var(--text-faint)]">
                  {d}
                </div>
              ))}
            </div>

            {/* day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {grid.map(({ date, inMonth }) => {
                const selectedDay = isSameDay(date, selected);
                const todayDay = isSameDay(date, today);
                return (
                  <button
                    key={toISO(date)}
                    type="button"
                    onClick={() => selectDate(date)}
                    className={`flex h-9 items-center justify-center rounded-lg text-[13px] font-medium transition ${
                      selectedDay
                        ? "bg-[var(--brand)] font-bold text-[var(--on-brand)] shadow-[0_2px_8px_rgba(var(--brand-rgb),0.32)]"
                        : todayDay
                        ? "bg-[var(--brand-soft)] font-bold text-[var(--brand)]"
                        : inMonth
                        ? "text-[var(--text-body)] hover:bg-[var(--bg-hover)]"
                        : "text-[var(--text-faint)] hover:bg-[var(--bg-hover)]"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* footer */}
            <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
              <button
                type="button"
                onClick={() => {
                  emit("");
                  setIsOpen(false);
                }}
                className="text-[12.5px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => selectDate(new Date())}
                className="text-[12.5px] font-semibold text-[var(--brand)] transition hover:opacity-80"
              >
                Today
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
