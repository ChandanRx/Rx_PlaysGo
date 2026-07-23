"use client";

import React, { useState } from "react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import Dropdown from "../ui/Dropdown";

/* Self-contained multi-series area chart for the learner dashboard. Three
 * series (Theory / Practice / Lexicon) plotted 0–100% across the week, each in
 * a distinct app token hue with a soft area wash. Drawn in a fixed viewBox
 * coordinate space scaled to 100% width — no JS measurement, so it renders on
 * first paint and never depends on ResizeObserver. */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SERIES = [
  { key: "Theory", color: "var(--info)", values: [30, 45, 40, 55, 60, 72, 80] },
  { key: "Practice", color: "var(--brand)", values: [42, 38, 55, 50, 68, 75, 88] },
  { key: "Lexicon", color: "var(--accent)", values: [20, 28, 35, 48, 52, 60, 70] },
];

// viewBox coordinate space
const W = 680;
const H = 260;
const M = { top: 20, right: 44, bottom: 28, left: 10 };
const innerW = W - M.left - M.right;
const innerH = H - M.top - M.bottom;

const xOf = (i) => M.left + (i / (DAYS.length - 1)) * innerW;
const yOf = (v) => M.top + innerH - (v / 100) * innerH;
const baseline = M.top + innerH;

// Smooth cardinal-spline path through the points.
const smoothLine = (pts) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const PLOTTED = SERIES.map((s) => {
  const pts = s.values.map((v, i) => ({ x: xOf(i), y: yOf(v) }));
  const line = smoothLine(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${baseline} L ${pts[0].x} ${baseline} Z`;
  return { ...s, pts, line, area };
});

const Y_TICKS = [0, 20, 40, 60, 80, 100];
const CALLOUT = PLOTTED[1].pts[3]; // Practice / Wed

const PerformancePanel = () => {
  const [range, setRange] = useState("Weekly");

  return (
    <section className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-black text-[var(--text-heading)]">Performance Chart</h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">Track results and watch your progress rise.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            variant="field"
            options={["Weekly", "Monthly", "Daily"]}
            value={range}
            onChange={setRange}
            className="w-[118px]"
            buttonClassName="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2 text-[12.5px] font-semibold"
          />
          <button
            type="button"
            aria-label="Expand chart"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
          >
            <ArrowsPointingOutIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.key}
          </span>
        ))}
      </div>

      {/* chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 block h-auto w-full"
        role="img"
        aria-label={`Weekly performance. ${SERIES.map((s) => `${s.key}: ${s.values.join(", ")}`).join("; ")}`}
      >
        <defs>
          {PLOTTED.map((s) => (
            <linearGradient key={s.key} id={`area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.34" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.03" />
            </linearGradient>
          ))}
          <linearGradient id="perf-strip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--success)" />
            <stop offset="50%" stopColor="var(--info)" />
            <stop offset="100%" stopColor="var(--brand)" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels (right side, like the reference) */}
        {Y_TICKS.map((v) => {
          const ty = yOf(v);
          return (
            <g key={v}>
              <line x1={M.left} x2={W - M.right} y1={ty} y2={ty} stroke="var(--border-light)" strokeWidth="1" />
              <text x={W - M.right + 8} y={ty + 3} fill="var(--text-faint)" style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}>
                {v}%
              </text>
            </g>
          );
        })}

        {/* x labels */}
        {DAYS.map((d, i) => (
          <text key={d} x={xOf(i)} y={H - 8} textAnchor="middle" fill="var(--text-faint)" style={{ fontSize: 11 }}>
            {d}
          </text>
        ))}

        {/* areas then lines */}
        {PLOTTED.map((s) => (
          <path key={`a-${s.key}`} d={s.area} fill={`url(#area-${s.key})`} />
        ))}
        {PLOTTED.map((s) => (
          <path key={`l-${s.key}`} d={s.line} fill="none" stroke={s.color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
        ))}

        {/* colorful baseline strip, like the reference */}
        <rect x={M.left} y={baseline + 6} width={W - M.left - M.right} height="5" rx="2.5" fill="url(#perf-strip)" opacity="0.9" />

        {/* highlighted point (Practice / Wed) + in-SVG callout so it scales */}
        <line x1={CALLOUT.x} x2={CALLOUT.x} y1={CALLOUT.y} y2={baseline} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
        <g transform={`translate(${CALLOUT.x - 94}, ${CALLOUT.y - 54})`}>
          <rect width="86" height="40" rx="13" fill="var(--text-heading)" />
          {/* tail pointing down toward the highlighted point */}
          <path d="M70 38 L84 52 L78 37 Z" fill="var(--text-heading)" />
          <text x="14" y="26" style={{ fontSize: 17, fontWeight: 800 }} fill="var(--bg-card)">+12</text>
          <text x="44" y="17" style={{ fontSize: 9 }} fill="var(--bg-card)" opacity="0.7">More</text>
          <text x="44" y="29" style={{ fontSize: 9 }} fill="var(--bg-card)" opacity="0.7">practice</text>
        </g>
        <circle cx={CALLOUT.x} cy={CALLOUT.y} r="5.5" fill="var(--brand)" stroke="var(--bg-card)" strokeWidth="2.5" />
      </svg>
    </section>
  );
};

export default PerformancePanel;
