"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/* Hand-rolled SVG area chart — posts per week over time.
 * Single series (brand-green viz slot), 2px line, ~10% area wash, hairline
 * solid gridlines. Hover shows a crosshair snapped to the nearest week with a
 * tooltip; the peak and latest points are direct-labeled and a <details> data
 * table carries every value, so the tooltip never gates a reading.
 *
 * NOTE: the underlying weekly buckets come from each post's `date` field (its
 * scheduled/event date) — a stand-in for a real created-at timestamp, which
 * the local data layer doesn't have. See getWeeklyActivity(). */

const HEIGHT = 240;
const MARGIN = { top: 18, right: 16, bottom: 26, left: 30 };

const niceMax = (max) => {
  if (max <= 5) return Math.max(2, max);
  if (max <= 10) return Math.ceil(max / 2) * 2;
  const mag = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / mag) * mag;
};

const useContainerWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Measure immediately — don't depend on ResizeObserver's initial delivery,
    // which some embedded browsers never dispatch.
    const measure = () => setWidth(el.getBoundingClientRect().width);
    measure();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return [ref, width];
};

const AdminTrendChart = ({ weeks }) => {
  const [wrapRef, width] = useContainerWidth();
  const [hover, setHover] = useState(null); // index

  const plot = useMemo(() => {
    if (!width || weeks.length === 0) return null;
    const innerW = width - MARGIN.left - MARGIN.right;
    const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;
    const yMax = niceMax(Math.max(...weeks.map((w) => w.count)));
    const x = (i) => MARGIN.left + (weeks.length === 1 ? innerW / 2 : (i / (weeks.length - 1)) * innerW);
    const y = (v) => MARGIN.top + innerH - (v / yMax) * innerH;

    const points = weeks.map((w, i) => ({ ...w, px: x(i), py: y(w.count) }));
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.px} ${p.py}`).join(" ");
    const baseline = MARGIN.top + innerH;
    const area = `${line} L ${points[points.length - 1].px} ${baseline} L ${points[0].px} ${baseline} Z`;

    const tickStep = yMax <= 5 ? 1 : Math.ceil(yMax / 4);
    const yTicks = [];
    for (let v = 0; v <= yMax; v += tickStep) yTicks.push(v);

    const labelEvery = Math.max(1, Math.ceil(weeks.length / 6));
    return { points, line, area, baseline, yMax, yTicks, labelEvery, innerW };
  }, [width, weeks]);

  if (weeks.length === 0) return null;

  const maxIdx = weeks.reduce((best, w, i) => (w.count > weeks[best].count ? i : best), 0);
  const lastIdx = weeks.length - 1;
  const hovered = hover !== null && plot ? plot.points[hover] : null;

  const handleMove = (event) => {
    if (!plot) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const px = event.clientX - rect.left;
    let nearest = 0;
    let bestDist = Infinity;
    plot.points.forEach((p, i) => {
      const d = Math.abs(p.px - px);
      if (d < bestDist) { bestDist = d; nearest = i; }
    });
    setHover(nearest);
  };

  return (
    <div>
      <div ref={wrapRef} className="relative" style={{ height: HEIGHT }}>
        {plot && (
          <svg width={width} height={HEIGHT} className="block" role="img"
            aria-label={`Posts per week: ${weeks.map((w) => `week of ${w.label}: ${w.count}`).join(", ")}`}
          >
            {/* hairline gridlines + y ticks */}
            {plot.yTicks.map((v) => {
              const ty = MARGIN.top + (HEIGHT - MARGIN.top - MARGIN.bottom) * (1 - v / plot.yMax);
              return (
                <g key={v}>
                  <line x1={MARGIN.left} x2={width - MARGIN.right} y1={ty} y2={ty}
                    stroke="var(--border-light)" strokeWidth="1" />
                  <text x={MARGIN.left - 8} y={ty + 3} textAnchor="end" fill="var(--text-faint)"
                    style={{ fontSize: 10, fontVariantNumeric: "tabular-nums" }}>
                    {v}
                  </text>
                </g>
              );
            })}

            {/* x labels */}
            {plot.points.map((p, i) =>
              i % plot.labelEvery === 0 || i === lastIdx ? (
                <text key={p.label + i} x={p.px} y={HEIGHT - 8} textAnchor="middle"
                  fill="var(--text-faint)" style={{ fontSize: 10 }}>
                  {p.label}
                </text>
              ) : null
            )}

            {/* area wash + line */}
            <path d={plot.area} fill="var(--viz-players)" opacity="0.1" />
            <path d={plot.line} fill="none" stroke="var(--viz-players)" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" />

            {/* crosshair */}
            {hovered && (
              <line x1={hovered.px} x2={hovered.px} y1={MARGIN.top} y2={plot.baseline}
                stroke="var(--border-strong)" strokeWidth="1" />
            )}

            {/* peak + latest markers, direct-labeled in text ink */}
            {[maxIdx, lastIdx].filter((v, i, arr) => arr.indexOf(v) === i).map((i) => {
              const p = plot.points[i];
              return (
                <g key={`mark-${i}`}>
                  <circle cx={p.px} cy={p.py} r="4" fill="var(--viz-players)"
                    stroke="var(--bg-card)" strokeWidth="2" />
                  <text x={p.px} y={p.py - 9} textAnchor="middle" fill="var(--text-heading)"
                    style={{ fontSize: 11, fontWeight: 700 }}>
                    {p.count}
                  </text>
                </g>
              );
            })}

            {/* hovered point marker */}
            {hovered && (
              <circle cx={hovered.px} cy={hovered.py} r="4.5" fill="var(--viz-players)"
                stroke="var(--bg-card)" strokeWidth="2" />
            )}

            {/* hover capture layer */}
            <rect x={0} y={0} width={width} height={HEIGHT} fill="transparent"
              onPointerMove={handleMove} onPointerLeave={() => setHover(null)} />
          </svg>
        )}

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 shadow-md"
            style={{
              left: Math.min(hovered.px + 10, Math.max(0, width - 130)),
              top: Math.max(hovered.py - 48, 2),
            }}
          >
            <p className="text-[13px] font-bold text-[var(--text-heading)]">
              {hovered.count} <span className="font-semibold text-[var(--text-muted)]">post{hovered.count === 1 ? "" : "s"}</span>
            </p>
            <p className="whitespace-nowrap text-[11px] text-[var(--text-muted)]">{hovered.rangeLabel}</p>
          </div>
        )}
      </div>

      {/* accessible twin: every weekly value, no hover required */}
      <details className="mt-3 border-t border-[var(--border-subtle)] pt-2">
        <summary className="cursor-pointer select-none text-[12px] font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text-heading)]">
          View as table
        </summary>
        <table className="mt-2 w-full max-w-sm text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
              <th className="py-1.5 pr-4">Week</th>
              <th className="py-1.5 text-right">Posts</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.start.getTime()} className="border-b border-[var(--border-light)] last:border-0">
                <td className="py-1.5 pr-4 text-[var(--text-body)]">{w.rangeLabel}</td>
                <td className="py-1.5 text-right font-semibold tabular-nums text-[var(--text-heading)]">{w.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
};

export default AdminTrendChart;
