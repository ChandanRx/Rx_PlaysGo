"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getCategoryLabel } from "../shared/appPreferences";
import { useStoredAppCategory } from "../hooks/useClientData";

const CategoryModePrompt = () => {
  const router = useRouter();
  const { hasCategory, isReady } = useStoredAppCategory();
  if (!isReady || hasCategory) return null;

  return (
    <div className="mb-5 flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#E8EDF5] bg-[#F8FAFC] px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF7A00]/10 text-3xl">🏟️</div>
      <h2 className="text-lg font-bold text-[#0F1623]">Pick a mode to get started</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-[#6B7280]">
        PlaysGo shows one category at a time — Sports, Helper, or Sale. Choose yours in Settings.
      </p>
      <button
        type="button"
        onClick={() => router.push("/settings")}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0F1623] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1e293b]"
      >
        Open Settings →
      </button>
    </div>
  );
};

export const CategoryModeBadge = () => {
  const { category, hasCategory, isReady } = useStoredAppCategory();
  const router = useRouter();
  if (!isReady || !hasCategory) return null;

  const emoji = { Players: "⚽", "Local Help": "🤝", "For Sale": "🛍️" };

  return (
    <button
      type="button"
      onClick={() => router.push("/settings")}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF5] bg-[#F8FAFC] px-3 py-1 text-[11px] font-semibold text-[#374151] transition hover:border-[#FF7A00] hover:text-[#FF7A00]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
      {emoji[category] || "📌"} {getCategoryLabel(category)}
      <span className="text-[#9CA3AF]">· Change</span>
    </button>
  );
};

export default CategoryModePrompt;
