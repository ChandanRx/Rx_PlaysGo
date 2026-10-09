"use client";

import { Suspense } from "react";
import FeedSection from "../../components/FeedSection";

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl p-8 text-center text-sm font-semibold text-[var(--text-muted)]">Loading feed…</div>}>
      <FeedSection />
    </Suspense>
  );
}