"use client";

import React from "react";

/* Shared loading + empty states so every admin tab treats "no data yet" and
 * "nothing matches" with the same visual weight as the chart sections. */

export const AdminLoading = ({ rows = 4 }) => (
  <div className="space-y-2.5 py-2" role="status" aria-label="Loading">
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        className="h-10 animate-pulse rounded-xl bg-[var(--bg-input)]"
        style={{ animationDelay: `${i * 80}ms` }}
      />
    ))}
    <span className="sr-only">Loading…</span>
  </div>
);

export const AdminEmpty = ({ icon: Icon, title, message, action }) => (
  <div className="flex flex-col items-center py-10 text-center">
    {Icon && (
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bg-secondary)]">
        <Icon className="h-5 w-5 text-[var(--text-muted)]" strokeWidth={2} />
      </span>
    )}
    <p className="mt-3 text-[14px] font-bold text-[var(--text-heading)]">{title}</p>
    {message && <p className="mt-1 max-w-xs text-[12.5px] text-[var(--text-muted)]">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
