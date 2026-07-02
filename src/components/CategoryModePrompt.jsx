"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Trophy } from "lucide-react";
import { getCategoryLabel } from "../shared/appPreferences";
import { useStoredAppCategory } from "../hooks/useClientData";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "../shared/lucideIcons";

const CategoryModePrompt = () => {
  const router = useRouter();
  const { hasCategory, isReady } = useStoredAppCategory();
  if (!isReady || hasCategory) return null;

  return (
    <div className="mb-5 flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
        <Trophy className="h-7 w-7" strokeWidth={2} />
      </div>
      <h2 className="text-lg font-bold text-[var(--text-heading)]">Pick a mode to get started</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-[var(--text-muted)]">
        PlaysGo shows one category at a time — Sports, Helper, or Sale. Choose yours in Settings.
      </p>
      <button
        type="button"
        onClick={() => router.push("/settings")}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--text-heading)] px-6 py-2.5 text-[13px] font-semibold text-[var(--selected-fg)] shadow-sm transition hover:bg-[var(--text-heading)]/85"
      >
        Open Settings
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
};

export const CategoryModeBadge = () => {
  const { category, hasCategory, isReady } = useStoredAppCategory();
  const router = useRouter();
  if (!isReady || !hasCategory) return null;

  const Icon = CATEGORY_ICONS[category] || DEFAULT_CATEGORY_ICON;

  return (
    <button
      type="button"
      onClick={() => router.push("/settings")}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-3 py-1 text-[11px] font-semibold text-[var(--text-body)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
      {getCategoryLabel(category)}
      <span className="text-[var(--text-faint)]">· Change</span>
    </button>
  );
};

export default CategoryModePrompt;
