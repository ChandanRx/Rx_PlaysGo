"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ClockIcon } from "@heroicons/react/24/outline";
import { popIn } from "../../shared/motionPresets";
import { fieldBaseClass } from "./FormControls";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1…12
const MINUTES = Array.from({ length: 60 }, (_, i) => i); // 0…59
const PERIODS = ["AM", "PM"];

const pad = (n) => String(n).padStart(2, "0");

// value is stored as 24-hour `HH:mm` (native <input type="time"> format).
const parse24 = (str) => {
  if (!str) return null;
  const [h, m] = str.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { h24: h, m };
};

const to24 = (hour12, minute, period) => {
  const h24 = period === "PM" ? (hour12 % 12) + 12 : hour12 % 12;
  return `${pad(h24)}:${pad(minute)}`;
};

// 24h parts → { hour12, minute, period }
const to12 = (h24, m) => ({
  hour12: h24 % 12 === 0 ? 12 : h24 % 12,
  minute: m,
  period: h24 >= 12 ? "PM" : "AM",
});

const formatDisplay = (str) => {
  const parsed = parse24(str);
  if (!parsed) return "";
  const { hour12, minute, period } = to12(parsed.h24, parsed.m);
  return `${pad(hour12)}:${pad(minute)} ${period}`;
};

const TimePicker = ({ name, value = "", onChange, className = "", disabled = false }) => {
  const rootRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const parsed = useMemo(() => parse24(value), [value]);
  const selected = parsed ? to12(parsed.h24, parsed.m) : null;

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

  // Center the selected hour/minute in their scroll columns when opened.
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      hourRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "center" });
      minuteRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const emit = (nextValue) => {
    onChange?.({ target: { name, value: nextValue, type: "time" } });
  };

  // Update one part; fall back to 12:00 AM (00:00) for the untouched parts.
  const setPart = (part, val) => {
    const base = parsed ? to12(parsed.h24, parsed.m) : { hour12: 12, minute: 0, period: "AM" };
    const next = { ...base, [part]: val };
    emit(to24(next.hour12, next.minute, next.period));
  };

  const columnClass =
    "flex-1 max-h-[176px] overflow-y-auto scrollbar-none scroll-py-1 space-y-0.5 px-0.5";
  const cellClass = (active) =>
    `flex h-8 w-full items-center justify-center rounded-lg text-[13px] font-medium transition ${
      active
        ? "bg-[var(--brand)] font-bold text-[var(--on-brand)] shadow-[0_2px_8px_rgba(var(--brand-rgb),0.32)]"
        : "text-[var(--text-body)] hover:bg-[var(--bg-hover)]"
    }`;

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
        {selected ? formatDisplay(value) : "--:--"}
      </button>
      <ClockIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]" />

      <AnimatePresence>
        {isOpen && (
          <m.div
            {...popIn}
            role="dialog"
            aria-label="Choose time"
            className="absolute left-0 z-50 mt-2 w-[248px] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3.5 shadow-[0_12px_32px_rgba(28,32,18,0.14)]"
          >
            {/* live selection header */}
            <p className="mb-3 text-center text-[16px] font-bold tracking-wide text-[var(--text-heading)]">
              {selected ? formatDisplay(value) : "--:-- --"}
            </p>

            {/* column labels */}
            <div className="mb-1 grid grid-cols-[1fr_1fr_auto] gap-2 text-[11px] font-semibold text-[var(--text-faint)]">
              <span className="text-center">Hour</span>
              <span className="text-center">Min</span>
              <span className="w-[52px] text-center">AM/PM</span>
            </div>

            <div className="flex gap-2">
              {/* hours */}
              <div ref={hourRef} className={columnClass}>
                {HOURS.map((h) => {
                  const active = selected?.hour12 === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      data-selected={active}
                      onClick={() => setPart("hour12", h)}
                      className={cellClass(active)}
                    >
                      {pad(h)}
                    </button>
                  );
                })}
              </div>

              {/* minutes */}
              <div ref={minuteRef} className={columnClass}>
                {MINUTES.map((min) => {
                  const active = selected?.minute === min;
                  return (
                    <button
                      key={min}
                      type="button"
                      data-selected={active}
                      onClick={() => setPart("minute", min)}
                      className={cellClass(active)}
                    >
                      {pad(min)}
                    </button>
                  );
                })}
              </div>

              {/* AM / PM */}
              <div className="flex w-[52px] flex-col gap-0.5">
                {PERIODS.map((p) => {
                  const active = selected?.period === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPart("period", p)}
                      className={cellClass(active)}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
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
                onClick={() => {
                  const now = new Date();
                  emit(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
                }}
                className="text-[12.5px] font-semibold text-[var(--brand)] transition hover:opacity-80"
              >
                Now
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[12.5px] font-semibold text-[var(--brand)] transition hover:opacity-80"
              >
                Done
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimePicker;
