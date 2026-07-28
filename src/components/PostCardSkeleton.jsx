"use client";

import React from "react";

/* Placeholder that mirrors PostItems' layout exactly — same image height,
 * body padding, divider and footer rows — so the grid doesn't reflow when the
 * real cards arrive. Keep the two in sync if the card layout changes. */

const Bar = ({ className = "" }) => (
  <div className={`rounded-md bg-[var(--bg-input)] ${className}`} />
);

const PostCardSkeleton = ({ index = 0 }) => (
  <div
    role="status"
    aria-label="Loading post"
    className="flex h-full w-full animate-pulse flex-col overflow-hidden rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_2px_12px_rgba(28,32,18,0.06)]"
    // Staggered so the grid ripples instead of flashing as one block.
    style={{ animationDelay: `${(index % 6) * 90}ms` }}
  >
    {/* image */}
    <div className="relative h-[150px] w-full bg-[var(--bg-secondary)] lg:h-[210px]">
      <Bar className="absolute left-2.5 top-2.5 h-5 w-24 rounded-full lg:left-3 lg:top-3" />
      <Bar className="absolute right-2.5 top-2.5 h-8 w-8 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md lg:right-3 lg:top-3" />
    </div>

    {/* body */}
    <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5 lg:px-4 lg:pb-4 lg:pt-3">
      <Bar className="h-[13px] w-[88%]" />
      <Bar className="mt-1.5 h-[13px] w-[62%]" />

      <Bar className="mt-1.5 h-[11px] w-[45%] lg:mt-2" />

      <div className="my-2 h-px bg-[var(--border-subtle)] lg:my-2.5" />

      <div className="mb-2.5 flex flex-wrap items-center gap-1.5 lg:mb-3">
        <Bar className="h-[18px] w-16 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md" />
        <Bar className="h-[18px] w-14 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md" />
        <Bar className="h-[18px] w-12 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md" />
      </div>

      {/* footer: avatar + name, CTA */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <div className="flex min-w-0 items-center gap-2">
          <Bar className="h-[34px] w-[34px] shrink-0 rounded-full lg:h-[40px] lg:w-[40px]" />
          <Bar className="h-[12px] w-20" />
        </div>
        <Bar className="h-11 w-[104px] shrink-0 rounded-tr-xl rounded-bl-xl rounded-tl-md rounded-br-md lg:h-10" />
      </div>
    </div>

    <span className="sr-only">Loading post…</span>
  </div>
);

export const PostCardSkeletonGrid = ({ count = 6, className = "" }) => (
  <div className={className || "grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3"}>
    {Array.from({ length: count }).map((_, i) => (
      <PostCardSkeleton key={i} index={i} />
    ))}
  </div>
);

export default PostCardSkeleton;
