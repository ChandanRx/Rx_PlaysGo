"use client";

import React, { useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

/* Shared click-to-sort helpers for the admin tables. `useTableSort` keeps the
 * active key + direction and returns the sorted rows; `SortHeader` is the
 * matching <th> — token-styled, keyboard-reachable, and carrying aria-sort so
 * assistive tech announces the order. Values are compared numerically when both
 * sides are numbers, as booleans when both are booleans, else as
 * locale-/numeric-aware strings. */

export const useTableSort = (items, initial = { key: null, dir: "asc" }) => {
  const [sort, setSort] = useState(initial);

  const toggle = (key) =>
    setSort((cur) =>
      cur.key === key
        ? { key, dir: cur.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const sorted = useMemo(() => {
    if (!sort.key) return items;
    const arr = [...items];
    arr.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      let cmp;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else if (typeof av === "boolean" && typeof bv === "boolean") cmp = av === bv ? 0 : av ? 1 : -1;
      else cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, { numeric: true, sensitivity: "base" });
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [items, sort]);

  return { sorted, sort, toggle };
};

export const SortHeader = ({ label, sortKey, sort, onSort, align = "left", className = "" }) => {
  const active = sort.key === sortKey;
  const Icon = !active ? ChevronUpDownIcon : sort.dir === "asc" ? ChevronUpIcon : ChevronDownIcon;
  return (
    <th
      className={`py-2.5 pr-4 ${className}`}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`group inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-[var(--text-heading)] ${
          align === "right" ? "flex-row-reverse" : ""
        } ${active ? "text-[var(--text-heading)]" : ""}`}
      >
        {label}
        <Icon
          className={`h-3 w-3 shrink-0 transition ${
            active ? "text-[var(--brand)]" : "text-[var(--text-faint)] opacity-0 group-hover:opacity-100"
          }`}
          strokeWidth={2.5}
        />
      </button>
    </th>
  );
};
