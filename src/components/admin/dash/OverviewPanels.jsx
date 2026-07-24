"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import {
  ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon, CheckCircleIcon,
  ClipboardDocumentListIcon, FlagIcon, MinusSmallIcon, UsersIcon,
} from "@heroicons/react/24/outline";
import { getPosts } from "../../../shared/dummyPosts";
import { getAdminStats, getReports, getUniqueUsers } from "../../../shared/adminStore";
import { getKpiDeltas, getTopCities, getWeeklyActivity } from "../adminAnalytics";
import { staggerItem } from "../../../shared/motionPresets";
import { STATUS_COLORS, categoryColor } from "../vizTheme";

/* ── shared shell ────────────────────────────────────────────────────────── */
const Panel = ({ className = "", children }) => (
  <m.section variants={staggerItem} className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-xs)] ${className}`}>
    {children}
  </m.section>
);

const useMounted = () => {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
};

/* ── KPI cards ───────────────────────────────────────────────────────────── */
const DELTA = {
  up:   { Icon: ArrowUpRightIcon,   color: "var(--success)", soft: "var(--success-soft)" },
  new:  { Icon: ArrowUpRightIcon,   color: "var(--success)", soft: "var(--success-soft)" },
  down: { Icon: ArrowDownRightIcon, color: "var(--danger)",  soft: "var(--danger-soft)" },
  flat: { Icon: MinusSmallIcon,     color: "var(--text-faint)", soft: "var(--bg-secondary)" },
};

const DeltaBadge = ({ delta }) => {
  if (!delta) return null;
  const meta = DELTA[delta.direction];
  if (!meta) return null;
  const { Icon, color, soft } = meta;
  return (
    <span className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold tabular-nums" style={{ color, background: soft }}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {delta.direction === "new" ? "New" : `${Math.abs(delta.pct)}%`}
    </span>
  );
};

const KpiCard = ({ label, value, delta, subtitle, icon: Icon, onArrow }) => (
  <m.div variants={staggerItem} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-xs)]">
    <div className="flex items-start justify-between">
      <p className="text-[12.5px] font-semibold text-[var(--text-muted)]">{label}</p>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--text-heading)]">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
    </div>
    <div className="mt-2.5 flex items-center gap-2">
      <p className="text-[26px] font-black leading-none text-[var(--text-heading)]">{value}</p>
      <DeltaBadge delta={delta} />
    </div>
    <div className="mt-2.5 flex items-end justify-between gap-2">
      <p className="text-[11.5px] text-[var(--text-faint)]">{subtitle}</p>
      <button
        type="button" aria-label={`Open ${label}`} onClick={onArrow}
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--text-heading)] shadow-[0_2px_8px_rgba(var(--accent-rgb),0.35)] transition hover:brightness-95"
      >
        <ArrowRightIcon className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  </m.div>
);

export const KpiCards = ({ onSelectTab }) => {
  const mounted = useMounted();
  const { stats, deltas } = useMemo(() => {
    if (!mounted) return { stats: null, deltas: null };
    return { stats: getAdminStats(), deltas: getKpiDeltas(getPosts(), getReports()) };
  }, [mounted]);

  const s = stats || { totalPosts: 0, activePosts: 0, uniqueUsers: 0, pendingReports: 0 };
  const cards = [
    { label: "Total posts", value: s.totalPosts, delta: deltas?.totalPosts, subtitle: "All posts in your pipeline.", icon: ClipboardDocumentListIcon, tab: "Posts" },
    { label: "Active posts", value: s.activePosts, delta: deltas?.activePosts, subtitle: "Currently live listings.", icon: CheckCircleIcon, tab: "Posts" },
    { label: "Unique users", value: s.uniqueUsers, delta: deltas?.uniqueUsers, subtitle: "Distinct post authors.", icon: UsersIcon, tab: "Users" },
    { label: "Pending reports", value: s.pendingReports, delta: deltas?.pendingReports, subtitle: "Flagged, awaiting review.", icon: FlagIcon, tab: "Reports" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <KpiCard key={c.label} {...c} value={mounted ? c.value : "–"} onArrow={() => onSelectTab(c.tab)} />
      ))}
    </div>
  );
};

/* ── Performance chart (real weekly posts, solid + trailing-avg dashed) ───── */
const W = 720;
const H = 260;
const M = { top: 18, right: 16, bottom: 28, left: 34 };
const innerW = W - M.left - M.right;
const innerH = H - M.top - M.bottom;

const smooth = (pts) => {
  if (pts.length < 2) return pts.length === 1 ? `M ${pts[0].x} ${pts[0].y}` : "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i]; const p1 = pts[i]; const p2 = pts[i + 1]; const p3 = pts[i + 2] || p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const RANGES = ["Month", "Quarter", "Year"];

export const RevenuePanel = () => {
  const mounted = useMounted();
  const [range, setRange] = useState("Month");

  const plot = useMemo(() => {
    if (!mounted) return null;
    const weeks = getWeeklyActivity();
    if (weeks.length === 0) return null;
    const counts = weeks.map((w) => w.count);
    // trailing 3-week average → the dashed comparison line
    const avg = counts.map((_, i) => {
      const slice = counts.slice(Math.max(0, i - 2), i + 1);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });
    const yMax = Math.max(2, ...counts, ...avg);
    const n = Math.max(1, weeks.length - 1);
    const xOf = (i) => M.left + (weeks.length === 1 ? innerW / 2 : (i / n) * innerW);
    const yOf = (v) => M.top + innerH - (v / yMax) * innerH;
    const baseline = M.top + innerH;
    const solidPts = counts.map((v, i) => ({ x: xOf(i), y: yOf(v), v, label: weeks[i].label, range: weeks[i].rangeLabel }));
    const dashPts = avg.map((v, i) => ({ x: xOf(i), y: yOf(v) }));
    const line = smooth(solidPts);
    const area = solidPts.length > 1 ? `${line} L ${solidPts[solidPts.length - 1].x} ${baseline} L ${solidPts[0].x} ${baseline} Z` : "";
    const peakIdx = counts.reduce((b, v, i) => (v > counts[b] ? i : b), 0);
    const ticks = Array.from({ length: yMax + 1 }, (_, i) => i).filter((v) => yMax <= 5 || v % Math.ceil(yMax / 4) === 0);
    const labelEvery = Math.max(1, Math.ceil(weeks.length / 7));
    return { solidPts, dashLine: smooth(dashPts), line, area, baseline, yMax, ticks, peak: solidPts[peakIdx], labels: weeks.map((w) => w.label), labelEvery, xOf };
  }, [mounted]);

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[17px] font-black text-[var(--text-heading)]">Post Performance</h2>
          <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">Weekly posting activity over time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--text-muted)]"><span className="h-2 w-2 rounded-full bg-[var(--info)]" /> Weekly</span>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--text-muted)]"><span className="h-0.5 w-3 rounded-full bg-[var(--text-faint)]" /> Trend</span>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1">
            {RANGES.map((r) => (
              <button key={r} type="button" onClick={() => setRange(r)}
                className={`rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition ${range === r ? "bg-[var(--bg-card)] text-[var(--text-heading)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {plot ? (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 block h-auto w-full" role="img"
          aria-label={`Weekly posts: ${plot.solidPts.map((p) => `${p.label} ${p.v}`).join(", ")}`}>
          <defs>
            <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {plot.ticks.map((v) => {
            const ty = M.top + innerH - (v / plot.yMax) * innerH;
            return (
              <g key={v}>
                <line x1={M.left} x2={W - M.right} y1={ty} y2={ty} stroke="var(--border-light)" strokeWidth="1" />
                <text x={M.left - 8} y={ty + 3} textAnchor="end" fill="var(--text-faint)" style={{ fontSize: 10 }}>{v}</text>
              </g>
            );
          })}
          {plot.labels.map((d, i) => (i % plot.labelEvery === 0 || i === plot.labels.length - 1) ? (
            <text key={`${d}-${i}`} x={plot.xOf(i)} y={H - 8} textAnchor="middle" fill="var(--text-faint)" style={{ fontSize: 10 }}>{d}</text>
          ) : null)}

          {plot.area && <path d={plot.area} fill="url(#rev-area)" />}
          <path d={plot.dashLine} fill="none" stroke="var(--text-faint)" strokeWidth="1.75" strokeDasharray="5 5" strokeLinecap="round" />
          <path d={plot.line} fill="none" stroke="var(--info)" strokeWidth="2.75" strokeLinejoin="round" strokeLinecap="round" />

          {plot.peak.v > 0 && (
            <>
              <line x1={plot.peak.x} x2={plot.peak.x} y1={plot.peak.y} y2={plot.baseline} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 3" />
              <g transform={`translate(${Math.min(Math.max(plot.peak.x - 55, 2), W - 118)}, ${Math.max(plot.peak.y - 46, 2)})`}>
                <rect width="112" height="38" rx="10" fill="var(--bg-card)" stroke="var(--border-subtle)" />
                <text x="10" y="16" style={{ fontSize: 9 }} fill="var(--text-muted)">{plot.peak.range}</text>
                <text x="10" y="30" style={{ fontSize: 13, fontWeight: 800 }} fill="var(--text-heading)">{plot.peak.v} posts</text>
              </g>
              <circle cx={plot.peak.x} cy={plot.peak.y} r="5" fill="var(--info)" stroke="var(--bg-card)" strokeWidth="2.5" />
            </>
          )}
        </svg>
      ) : (
        <div className="mt-3 h-[220px] animate-pulse rounded-xl bg-[var(--bg-input)]" />
      )}
    </Panel>
  );
};

/* ── Locations (Customers Overview style) ────────────────────────────────── */
export const LocationsPanel = () => {
  const mounted = useMounted();
  const { cities, total } = useMemo(() => {
    if (!mounted) return { cities: [], total: 0 };
    const c = getTopCities(getPosts(), 5);
    return { cities: c, total: getAdminStats().totalPosts };
  }, [mounted]);
  const max = Math.max(1, ...cities.map((c) => c.count));

  return (
    <Panel className="flex h-full flex-col">
      <h2 className="text-[17px] font-black text-[var(--text-heading)]">Locations Overview</h2>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-[26px] font-black leading-none text-[var(--text-heading)]">{mounted ? total : "–"}</p>
        <span className="text-[11.5px] font-semibold text-[var(--text-muted)]">total posts</span>
      </div>
      <ul className="mt-4 flex flex-1 flex-col justify-center gap-3.5">
        {cities.map((c) => (
          <li key={c.label}>
            <div className="flex items-center justify-between text-[12.5px]">
              <span className="inline-flex items-center gap-2 font-semibold text-[var(--text-heading)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                {c.label}
              </span>
              <span className="font-bold tabular-nums text-[var(--text-body)]">{c.count.toLocaleString()}</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${(c.count / max) * 100}%` }} />
            </div>
          </li>
        ))}
        {cities.length === 0 && <li className="text-[12.5px] text-[var(--text-muted)]">No location data yet.</li>}
      </ul>
    </Panel>
  );
};

/* ── Content health donut (Team Performance style) ───────────────────────── */
export const DonutPanel = () => {
  const mounted = useMounted();
  const { active, total, pct } = useMemo(() => {
    if (!mounted) return { active: 0, total: 0, pct: 0 };
    const s = getAdminStats();
    return { active: s.activePosts, total: s.totalPosts, pct: s.totalPosts ? Math.round((s.activePosts / s.totalPosts) * 100) : 0 };
  }, [mounted]);

  const R = 52; const C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;

  return (
    <Panel className="flex h-full flex-col">
      <h2 className="text-[17px] font-black text-[var(--text-heading)]">Content Health</h2>
      <div className="relative mx-auto mt-4 flex flex-1 items-center justify-center">
        <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
          <circle cx="75" cy="75" r={R} fill="none" stroke="var(--bg-secondary)" strokeWidth="14" />
          <circle cx="75" cy="75" r={R} fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${dash} ${C - dash}`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-black leading-none text-[var(--text-heading)]">{mounted ? active : "–"}</span>
          <span className="text-[10.5px] font-medium text-[var(--text-faint)]">Active posts</span>
        </div>
      </div>
      <p className="mt-2 text-center text-[12px] text-[var(--text-muted)]">
        <span className="font-black text-[var(--text-heading)]">{pct}%</span> of {total} posts are live
      </p>
    </Panel>
  );
};

/* ── Recent activity (Upcoming Activities style) ─────────────────────────── */
export const ActivitiesPanel = ({ onOpenPost }) => {
  const mounted = useMounted();
  const posts = useMemo(() => (mounted ? getPosts().slice(0, 4) : []), [mounted]);

  return (
    <Panel className="flex h-full flex-col">
      <h2 className="text-[17px] font-black text-[var(--text-heading)]">Recent Activity</h2>
      <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">Latest posts on the platform</p>
      <ul className="mt-4 flex flex-1 flex-col gap-2.5">
        {posts.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onOpenPost?.(p)} className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] p-2 text-left transition hover:border-[var(--text-heading)]">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
                <Image src={p.imageUrl} alt="" width={40} height={40} unoptimized className="h-10 w-10 object-cover" />
                <span aria-hidden className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full ring-2 ring-[var(--bg-card)]" style={{ background: categoryColor(p.category) }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-[var(--text-heading)]">{p.title}</span>
                <span className="block truncate text-[11px] text-[var(--text-faint)]">{p.userName} · {p.postedTime}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

/* ── Recent posts table (Active Deals Overview style) ────────────────────── */
const ORGANIZERS = ["Recent", "Category", "Status"];
const STATUS_ORDER = { Active: 0, Draft: 1, Closed: 2, Expired: 3 };

export const DealsTablePanel = ({ onOpenPost, onSelectTab }) => {
  const mounted = useMounted();
  const [organizeBy, setOrganizeBy] = useState("Recent");
  const all = useMemo(() => (mounted ? getPosts() : []), [mounted]);

  // Same rows, organized in different ways.
  const posts = useMemo(() => {
    const list = [...all];
    if (organizeBy === "Category") list.sort((a, b) => a.category.localeCompare(b.category));
    else if (organizeBy === "Status") list.sort((a, b) => (STATUS_ORDER[a.status ?? "Active"] ?? 9) - (STATUS_ORDER[b.status ?? "Active"] ?? 9));
    return list.slice(0, 6);
  }, [all, organizeBy]);

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[17px] font-black text-[var(--text-heading)]">Recent Posts Overview</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-1">
            {ORGANIZERS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOrganizeBy(o)}
                className={`rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition ${
                  organizeBy === o ? "bg-[var(--bg-card)] text-[var(--text-heading)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onSelectTab("Posts")} className="rounded-lg bg-[var(--accent-soft)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--text-heading)] transition hover:brightness-95">
            All posts
          </button>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[10.5px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
              <th className="py-2 pr-4">Post</th>
              <th className="py-2 pr-4">Author</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="cursor-pointer border-b border-[var(--border-subtle)] transition-colors last:border-0 hover:bg-[var(--bg-secondary)]/60" onClick={() => onOpenPost?.(p)}>
                <td className="py-2.5 pr-4">
                  <span className="flex items-center gap-2.5">
                    <Image src={p.imageUrl} alt="" width={36} height={36} unoptimized className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0">
                      <span className="block max-w-[160px] truncate font-semibold text-[var(--text-heading)]">{p.title}</span>
                      <span className="block text-[10.5px] text-[var(--text-faint)]">#{p.id.slice(-4).toUpperCase()}</span>
                    </span>
                  </span>
                </td>
                <td className="max-w-[120px] truncate py-2.5 pr-4 text-[var(--text-body)]">{p.userName}</td>
                <td className="py-2.5 pr-4 text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: categoryColor(p.category) }} />
                    {p.category}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-body)]">
                    <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[p.status] || STATUS_COLORS.Active }} />
                    {p.status || "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
