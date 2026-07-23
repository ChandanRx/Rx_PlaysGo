"use client";

import React, { useState } from "react";
import {
  BookOpenIcon, PencilSquareIcon, PlayCircleIcon, PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import Dropdown from "../ui/Dropdown";

/* Homework checklist — each task shows a progress meter + percent. The meter
 * fill is a brand→info token gradient so it reads the same in both themes. */
const TASKS = [
  { label: "Learn 10 new words today", pct: 57, icon: BookOpenIcon },
  { label: "Do 1 grammar task today", pct: 42, icon: PuzzlePieceIcon },
  { label: "Watch a video, answer 3 questions", pct: 31, icon: PlayCircleIcon },
  { label: "Write 3 sentences with vocab", pct: 84, icon: PencilSquareIcon },
];

const HomeworkPanel = () => {
  const [range, setRange] = useState("Day");

  return (
    <section className="flex h-full flex-col rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-black text-[var(--text-heading)]">Homework</h2>
          <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">Check and complete tasks</p>
        </div>
        <Dropdown
          variant="field"
          options={["Day", "Week", "Month"]}
          value={range}
          onChange={setRange}
          className="w-[96px]"
          buttonClassName="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-1.5 text-[12px] font-semibold"
        />
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3.5">
        {TASKS.map(({ label, pct, icon: Icon }) => (
          <li key={label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-[var(--text-heading)]">{label}</p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--info), var(--brand))" }}
                />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-[14px] font-black tabular-nums text-[var(--text-heading)]">{pct}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeworkPanel;
