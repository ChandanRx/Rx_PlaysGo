"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ArrowsPointingOutIcon, CalendarDaysIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getPosts } from "../../../shared/dummyPosts";
import { getUniqueUsers } from "../../../shared/adminStore";
import { getCategoryCounts, getWeeklyByCategory } from "../adminAnalytics";
import { categoryColor } from "../vizTheme";

/* ── Panel shell ─────────────────────────────────────────────────────────── */
const Panel = ({ className = "", children }) => (
  <section className={`rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)] ${className}`}>
    {children}
  </section>
);

const PanelHead = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="text-[18px] font-black text-[var(--text-heading)]">{title}</h2>
      {subtitle && <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* Category → soft card tint (mirrors the reference's three-tint course cards). */
const CARD_TINT = {
  Players: { bg: "var(--brand-soft)", border: "var(--brand-border)" },
  "Local Help": { bg: "var(--info-soft)", border: "#B9DCFF" },
  "For Sale": { bg: "var(--success-soft)", border: "#B6E9CB" },
};
const tintFor = (category) => CARD_TINT[category] || { bg: "var(--bg-secondary)", border: "var(--border-subtle)" };

/* ── Recent posts (tall left panel) ──────────────────────────────────────── */
export const RecentPostsPanel = ({ onOpenPost }) => {
  const [query, setQuery] = useState("");
  const posts = useMemo(() => getPosts(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? posts.filter((p) => p.title.toLowerCase().includes(q)) : posts;
    return base.slice(0, 6);
  }, [posts, query]);

  return (
    <Panel className="flex h-full flex-col">
      <PanelHead
        title="Recent posts"
        subtitle="Review the latest activity."
        action={
          <button type="button" aria-label="Expand" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]">
            <ArrowsPointingOutIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        }
      />

      <div className="mt-4 flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] py-1.5 pl-4 pr-1.5">
        <input
          type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts"
          className="w-full min-w-0 bg-transparent text-[13px] text-[var(--text-heading)] outline-none placeholder:text-[var(--text-faint)]"
        />
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--selected-bg)] text-[var(--selected-fg)]">
          <MagnifyingGlassIcon className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {filtered.map((post) => {
          const tint = tintFor(post.category);
          return (
            <button
              key={post.id}
              type="button"
              onClick={() => onOpenPost?.(post)}
              className="group rounded-[22px] border p-4 text-left outline-none transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
              style={{ background: tint.bg, borderColor: tint.border }}
            >
              <div className="flex items-center gap-1.5">
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: categoryColor(post.category) }} />
                <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{post.category}</span>
              </div>
              <h3 className="mt-1.5 truncate text-[15px] font-black text-[var(--text-heading)]">{post.title}</h3>
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[var(--text-body)]">{post.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--text-heading)] px-2.5 py-1.5 text-[11px] font-semibold text-[var(--bg-card)]">
                  <CalendarDaysIcon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {post.date || post.postedTime}
                </span>
                <Image
                  src={post.userImage}
                  alt={post.userName}
                  width={28} height={28} unoptimized={post.userImage?.startsWith("data:")}
                  className="h-7 w-7 rounded-full border-2 border-[var(--bg-card)] object-cover"
                />
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-6 text-center text-[12.5px] text-[var(--text-muted)]">No posts match “{query}”.</p>
        )}
      </div>
    </Panel>
  );
};

/* ── Performance chart (real weekly-by-category) ─────────────────────────── */
const W = 680;
const H = 250;
const M = { top: 18, right: 40, bottom: 26, left: 10 };
const innerW = W - M.left - M.right;
const innerH = H - M.top - M.bottom;

const SERIES_COLOR = { Players: "var(--brand)", "Local Help": "var(--info)", "For Sale": "var(--accent)" };

const smoothLine = (pts) => {
  if (pts.length < 2) return pts.length === 1 ? `M ${pts[0].x} ${pts[0].y}` : "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
};

export const PerformancePanel = () => {
  const { labels, series, plotted, yMax, peak } = useMemo(() => {
    const data = getWeeklyByCategory();
    const n = Math.max(1, data.labels.length - 1);
    const rawMax = Math.max(1, ...data.series.flatMap((s) => s.values));
    const yTop = Math.max(2, Math.ceil(rawMax));
    const xOf = (i) => M.left + (data.labels.length <= 1 ? innerW / 2 : (i / n) * innerW);
    const yOf = (v) => M.top + innerH - (v / yTop) * innerH;
    const baseline = M.top + innerH;

    let peakPoint = null;
    const plottedSeries = data.series.map((s) => {
      const pts = s.values.map((v, i) => {
        const p = { x: xOf(i), y: yOf(v), v, label: data.labels[i] };
        if (!peakPoint || v > peakPoint.v) peakPoint = { ...p, key: s.key };
        return p;
      });
      const line = smoothLine(pts);
      const area = pts.length > 1 ? `${line} L ${pts[pts.length - 1].x} ${baseline} L ${pts[0].x} ${baseline} Z` : "";
      return { ...s, color: SERIES_COLOR[s.key], pts, line, area };
    });
    return { labels: data.labels, series: data.series, plotted: plottedSeries, yMax: yTop, peak: peakPoint, baseline };
  }, []);

  const baseline = M.top + innerH;
  const yTicks = Array.from({ length: yMax + 1 }, (_, i) => i).filter((v) => yMax <= 5 || v % Math.ceil(yMax / 4) === 0);

  return (
    <Panel>
      <PanelHead
        title="Performance Chart"
        subtitle="Track posting activity across categories."
        action={
          <button type="button" aria-label="Expand chart" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] transition hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]">
            <ArrowsPointingOutIcon className="h-4 w-4" strokeWidth={2} />
          </button>
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-4">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-muted)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SERIES_COLOR[s.key] }} />
            {s.key}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block h-auto w-full" role="img"
        aria-label={`Weekly posts by category. ${series.map((s) => `${s.key}: ${s.values.join(", ")}`).join("; ")}`}>
        <defs>
          {plotted.map((s) => (
            <linearGradient key={s.key} id={`ov-area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.03" />
            </linearGradient>
          ))}
          <linearGradient id="ov-strip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--success)" />
            <stop offset="50%" stopColor="var(--info)" />
            <stop offset="100%" stopColor="var(--brand)" />
          </linearGradient>
        </defs>

        {yTicks.map((v) => {
          const ty = M.top + innerH - (v / yMax) * innerH;
          return (
            <g key={v}>
              <line x1={M.left} x2={W - M.right} y1={ty} y2={ty} stroke="var(--border-light)" strokeWidth="1" />
              <text x={W - M.right + 8} y={ty + 3} fill="var(--text-faint)" style={{ fontSize: 10 }}>{v}</text>
            </g>
          );
        })}

        {labels.map((d, i) => {
          const x = M.left + (labels.length <= 1 ? innerW / 2 : (i / Math.max(1, labels.length - 1)) * innerW);
          const every = Math.max(1, Math.ceil(labels.length / 6));
          return i % every === 0 || i === labels.length - 1 ? (
            <text key={`${d}-${i}`} x={x} y={H - 8} textAnchor="middle" fill="var(--text-faint)" style={{ fontSize: 10 }}>{d}</text>
          ) : null;
        })}

        {plotted.map((s) => s.area && <path key={`a-${s.key}`} d={s.area} fill={`url(#ov-area-${s.key})`} />)}
        {plotted.map((s) => <path key={`l-${s.key}`} d={s.line} fill="none" stroke={s.color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />)}

        <rect x={M.left} y={baseline + 6} width={innerW} height="5" rx="2.5" fill="url(#ov-strip)" opacity="0.9" />

        {peak && peak.v > 0 && (
          <>
            <line x1={peak.x} x2={peak.x} y1={peak.y} y2={baseline} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
            <g transform={`translate(${Math.max(peak.x - 92, 2)}, ${Math.max(peak.y - 52, 2)})`}>
              <rect width="96" height="38" rx="13" fill="var(--text-heading)" />
              <text x="13" y="24" style={{ fontSize: 16, fontWeight: 800 }} fill="var(--bg-card)">{peak.v}</text>
              <text x="34" y="16" style={{ fontSize: 8.5 }} fill="var(--bg-card)" opacity="0.7">peak week</text>
              <text x="34" y="27" style={{ fontSize: 8.5 }} fill="var(--bg-card)" opacity="0.7">{peak.key}</text>
            </g>
            <circle cx={peak.x} cy={peak.y} r="5" fill={SERIES_COLOR[peak.key]} stroke="var(--bg-card)" strokeWidth="2.5" />
          </>
        )}
      </svg>
    </Panel>
  );
};

/* ── Category breakdown (%-rows, like the reference Homework panel) ───────── */
export const CategoryBreakdownPanel = () => {
  const data = useMemo(() => {
    const counts = getCategoryCounts();
    const total = counts.reduce((sum, c) => sum + c.count, 0) || 1;
    return counts.map((c) => ({ ...c, pct: Math.round((c.count / total) * 100) }));
  }, []);

  return (
    <Panel className="flex h-full flex-col">
      <PanelHead title="Category share" subtitle="How posts split across categories" />
      <ul className="mt-4 flex flex-1 flex-col justify-center gap-4">
        {data.map((c) => (
          <li key={c.category} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${categoryColor(c.category)} 16%, transparent)` }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor(c.category) }} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-[12.5px] font-semibold text-[var(--text-heading)]">{c.category}</p>
                <span className="text-[11px] font-medium text-[var(--text-faint)]">{c.count} posts</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: categoryColor(c.category) }} />
              </div>
            </div>
            <span className="w-10 shrink-0 text-right text-[14px] font-black tabular-nums text-[var(--text-heading)]">{c.pct}%</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

/* ── Top contributors (leaderboard, like the reference Friends Score) ─────── */
export const ContributorsPanel = ({ onSelectUser }) => {
  const users = useMemo(() => getUniqueUsers().slice(0, 4), []);

  return (
    <Panel className="flex h-full flex-col">
      <PanelHead
        title="Top contributors"
        subtitle="Most active users on the platform"
        action={<span className="rounded-full border border-[var(--border-subtle)] px-4 py-1.5 text-[12px] font-semibold text-[var(--text-muted)]">All</span>}
      />
      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {users.map((u) => (
          <li key={u.email}>
            <button type="button" onClick={() => onSelectUser?.(u.email)} className="flex w-full items-center gap-3 text-left">
              <Image src={u.image} alt={u.name} width={38} height={38} unoptimized={u.image?.startsWith("data:")} className="h-[38px] w-[38px] shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-[13px] font-bold text-[var(--text-heading)]">
                  {u.name}
                  {u.isVerified && <CheckBadgeIcon className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" />}
                </p>
                <p className="truncate text-[11px] text-[var(--text-faint)]">{u.city}</p>
              </div>
              <span className="shrink-0 text-right">
                <span className="block text-[16px] font-black tabular-nums leading-none text-[var(--text-heading)]">{u.postCount}</span>
                <span className="text-[10px] font-medium text-[var(--text-faint)]">posts</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
};
