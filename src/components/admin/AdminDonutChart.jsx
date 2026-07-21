"use client";

import React, { useRef, useState } from "react";

/* Hand-rolled SVG donut — part-to-whole category share (≤ 4 segments).
 * Segments carry the fixed category colors; a 2px surface-color stroke forms
 * the gap between touching fills. The legend lists every value + share, so the
 * hover tooltip enhances but never gates a reading. */

const TAU = Math.PI * 2;

const polar = (cx, cy, r, angle) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];

const arcPath = (cx, cy, r0, r1, a0, a1) => {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(cx, cy, r1, a0);
  const [x1, y1] = polar(cx, cy, r1, a1);
  const [x2, y2] = polar(cx, cy, r0, a1);
  const [x3, y3] = polar(cx, cy, r0, a0);
  return [
    `M ${x0} ${y0}`,
    `A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3}`,
    "Z",
  ].join(" ");
};

const AdminDonutChart = ({ data, centerLabel = "posts" }) => {
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null); // { index, x, y }

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r1 = 88;
  const r0 = 58;

  let angle = -Math.PI / 2;
  const segments = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const sweep = Math.min((d.value / total) * TAU, TAU - 0.0001);
      const seg = { ...d, a0: angle, a1: angle + sweep, mid: angle + sweep / 2 };
      angle += sweep;
      return seg;
    });

  const pct = (value) => `${Math.round((value / total) * 100)}%`;

  const moveTooltip = (event) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  // Keyboard focus anchors the tooltip at the segment's centroid.
  const centroidTooltip = (seg) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    const svgBox = wrapRef.current?.querySelector("svg")?.getBoundingClientRect();
    if (!rect || !svgBox) return { x: 0, y: 0 };
    const scale = svgBox.width / size;
    const [px, py] = polar(cx, cy, (r0 + r1) / 2, seg.mid);
    return { x: svgBox.left - rect.left + px * scale, y: svgBox.top - rect.top + py * scale };
  };

  const hovered = hover ? segments[hover.index] : null;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div ref={wrapRef} className="relative w-[172px] shrink-0 sm:w-[188px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="block w-full" role="img"
          aria-label={`Category share: ${segments.map((s) => `${s.label} ${s.value} (${pct(s.value)})`).join(", ")}`}
        >
          {segments.map((seg, i) => (
            <path
              key={seg.label}
              d={arcPath(cx, cy, r0, r1, seg.a0, seg.a1)}
              fill={seg.color}
              stroke="var(--bg-card)"
              strokeWidth="2"
              tabIndex={0}
              aria-label={`${seg.label}: ${seg.value} (${pct(seg.value)})`}
              className="cursor-pointer outline-none transition-opacity duration-150 focus-visible:opacity-100"
              opacity={hover === null || hover.index === i ? 1 : 0.4}
              onPointerMove={(e) => {
                const pos = moveTooltip(e);
                if (pos) setHover({ index: i, ...pos });
              }}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover({ index: i, ...centroidTooltip(seg) })}
              onBlur={() => setHover(null)}
            />
          ))}
          <text x={cx} y={cy - 3} textAnchor="middle" fill="var(--text-heading)"
            style={{ fontSize: 32, fontWeight: 800 }}>
            {total}
          </text>
          <text x={cx} y={cy + 18} textAnchor="middle" fill="var(--text-muted)"
            style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {centerLabel}
          </text>
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 shadow-md"
            style={{ left: hover.x + 12, top: hover.y - 12 }}
          >
            <p className="whitespace-nowrap text-[13px] font-bold text-[var(--text-heading)]">
              {hovered.value} <span className="font-semibold text-[var(--text-muted)]">· {pct(hovered.value)}</span>
            </p>
            <p className="text-[11px] text-[var(--text-muted)]">{hovered.label}</p>
          </div>
        )}
      </div>

      {/* legend doubles as the table view: every value is readable without hover */}
      <ul className="w-full min-w-0 flex-1 space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2.5 text-[13px]">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: d.color }} />
            <span className="min-w-0 flex-1 truncate font-semibold text-[var(--text-body)]">{d.label}</span>
            <span className="font-bold tabular-nums text-[var(--text-heading)]">{d.value}</span>
            <span className="w-9 text-right text-[12px] tabular-nums text-[var(--text-muted)]">
              {total ? pct(d.value) : "0%"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDonutChart;
