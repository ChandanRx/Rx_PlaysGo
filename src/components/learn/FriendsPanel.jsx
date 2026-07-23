"use client";

import React from "react";
import Image from "next/image";
import { AcademicCapIcon, ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import { getGenderAvatar } from "../../shared/doodleAvatars";

/* Friends leaderboard, ranked by score. Placeholder roster for the showcase —
 * avatars come from the app's doodle avatar set. */
const FRIENDS = [
  { name: "Anna Morgan", avatar: getGenderAvatar("female", 4), lessons: 25, hours: 832, streak: 48, score: 10568 },
  { name: "Jake Thompson", avatar: getGenderAvatar("male", 9), lessons: 23, hours: 778, streak: 39, score: 10234 },
  { name: "Sofia Bennett", avatar: getGenderAvatar("female", 11), lessons: 20, hours: 742, streak: 33, score: 9892 },
  { name: "Emily Carter", avatar: getGenderAvatar("female", 19), lessons: 17, hours: 643, streak: 28, score: 9322 },
];

const MiniStat = ({ icon: Icon, value }) => (
  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-faint)]">
    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
    {value}
  </span>
);

const FriendsPanel = () => (
  <section className="flex h-full flex-col rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[18px] font-black text-[var(--text-heading)]">Friends Score</h2>
        <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">See how you rank among friends</p>
      </div>
      <button
        type="button"
        className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-1.5 text-[12px] font-semibold text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
      >
        All
      </button>
    </div>

    <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
      {FRIENDS.map((f) => (
        <li key={f.name} className="flex items-center gap-3">
          <Image
            src={f.avatar}
            alt={f.name}
            width={38}
            height={38}
            unoptimized
            className="h-[38px] w-[38px] shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-[var(--text-heading)]">{f.name}</p>
            <div className="mt-0.5 flex items-center gap-2.5">
              <MiniStat icon={AcademicCapIcon} value={f.lessons} />
              <MiniStat icon={ClockIcon} value={`${f.hours}h`} />
              <MiniStat icon={FireIcon} value={f.streak} />
            </div>
          </div>
          <span className="shrink-0 text-[16px] font-black tabular-nums text-[var(--text-heading)]">
            {f.score.toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

export default FriendsPanel;
