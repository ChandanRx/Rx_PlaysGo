"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowsPointingOutIcon, CalendarDaysIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getGenderAvatar } from "../../shared/doodleAvatars";

/* Course tints reuse the app's soft status/brand tokens rather than raw hex, so
 * each card keeps a distinct hue in both light and dark. */
const COURSES = [
  {
    title: "Speak with Confidence",
    blurb: "Learn how to speak English clearly and confidently in everyday situations.",
    date: "27 Apr 2025",
    tint: "var(--brand-soft)",
    border: "var(--brand-border)",
    avatars: [getGenderAvatar("female", 4), getGenderAvatar("male", 9)],
  },
  {
    title: "Master the Basics",
    blurb: "Build a strong foundation with essential grammar and vocabulary.",
    date: "30 Apr 2025",
    tint: "var(--info-soft)",
    border: "#B9DCFF",
    avatars: [getGenderAvatar("male", 2), getGenderAvatar("female", 11)],
  },
  {
    title: "Sound Like a Native",
    blurb: "Improve your pronunciation and intonation for natural speech.",
    date: "15 May 2025",
    tint: "var(--success-soft)",
    border: "#B6E9CB",
    avatars: [getGenderAvatar("female", 19), getGenderAvatar("male", 16)],
  },
];

const AvatarCluster = ({ images }) => (
  <div className="flex -space-x-2">
    {images.map((src, i) => (
      <Image
        key={i}
        src={src}
        alt=""
        width={26}
        height={26}
        unoptimized
        className="h-[26px] w-[26px] rounded-full border-2 border-[var(--bg-card)] object-cover"
      />
    ))}
  </div>
);

const CoursePanel = () => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COURSES;
    return COURSES.filter((c) => c.title.toLowerCase().includes(q) || c.blurb.toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[19px] font-black text-[var(--text-heading)]">Select a course</h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">Start learning today.</p>
        </div>
        <button
          type="button"
          aria-label="Expand courses"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
        >
          <ArrowsPointingOutIcon className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* search with trailing round button */}
      <div className="mt-4 flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] py-1.5 pl-4 pr-1.5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-full min-w-0 bg-transparent text-[13px] text-[var(--text-heading)] outline-none placeholder:text-[var(--text-faint)]"
        />
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--selected-bg)] text-[var(--selected-fg)]">
          <MagnifyingGlassIcon className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </div>

      {/* course cards */}
      <div className="mt-4 flex flex-1 flex-col gap-3.5">
        {filtered.map((course) => (
          <article
            key={course.title}
            tabIndex={0}
            className="group rounded-[22px] border p-4 outline-none transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            style={{ background: course.tint, borderColor: course.border }}
          >
            <h3 className="text-[16px] font-black text-[var(--text-heading)]">{course.title}</h3>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-body)]">{course.blurb}</p>
            <div className="mt-3.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--text-heading)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--bg-card)]">
                <CalendarDaysIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                {course.date}
              </span>
              <AvatarCluster images={course.avatars} />
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-[12.5px] text-[var(--text-muted)]">No courses match “{query}”.</p>
        )}
      </div>
    </section>
  );
};

export default CoursePanel;
