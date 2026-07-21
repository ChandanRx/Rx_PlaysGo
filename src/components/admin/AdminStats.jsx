"use client";

import React, { useEffect, useState } from "react";
import { CheckCircleIcon, ClipboardDocumentListIcon, FlagIcon, UsersIcon } from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import { getAdminStats } from "../../shared/adminStore";
import { getPosts } from "../../shared/dummyPosts";
import { getWeeklyActivity } from "./adminAnalytics";

/* 12-point sparkline for the "Total posts" tile: recent weekly activity in the
 * de-emphasis ink, latest week marked in the brand hue. */
const Sparkline = ({ values }) => {
  if (values.length < 2) return null;
  const w = 84;
  const h = 26;
  const max = Math.max(1, ...values);
  const x = (i) => (i / (values.length - 1)) * (w - 6) + 3;
  const y = (v) => h - 4 - (v / max) * (h - 8);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <svg width={w} height={h} className="mt-1 block" aria-hidden>
      <polyline points={points} fill="none" stroke="var(--text-faint)" strokeWidth="1.5"
        strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="2.5" fill="var(--brand)" />
    </svg>
  );
};

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    setStats(getAdminStats());
    setWeekly(getWeeklyActivity(getPosts()).map((w) => w.count).slice(-12));
  }, []);

  const s = stats || { totalPosts: 0, activePosts: 0, uniqueUsers: 0, pendingReports: 0 };
  const activePct = s.totalPosts ? Math.round((s.activePosts / s.totalPosts) * 100) : 0;
  const perUser = s.uniqueUsers ? (s.totalPosts / s.uniqueUsers).toFixed(1) : "0";

  const items = [
    {
      label: "Total posts",
      value: s.totalPosts,
      icon: ClipboardDocumentListIcon,
      extra: <Sparkline values={weekly} />,
    },
    {
      label: "Active posts",
      value: s.activePosts,
      icon: CheckCircleIcon,
      detail: `${activePct}% of all posts`,
    },
    {
      label: "Unique users",
      value: s.uniqueUsers,
      icon: UsersIcon,
      detail: `~${perUser} posts per user`,
    },
    {
      label: "Pending reports",
      value: s.pendingReports,
      icon: FlagIcon,
      detail: s.pendingReports > 0 ? "Needs review" : "All clear",
      alert: s.pendingReports > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon, detail, extra, alert }) => (
        <Card key={label} className="p-3.5 sm:p-4" hover={false}>
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-[11px] sm:tracking-[0.15em]">
              {label}
            </p>
            <Icon
              className={`h-[18px] w-[18px] shrink-0 sm:h-5 sm:w-5 ${alert ? "text-[var(--warning)]" : "text-[var(--brand)]"}`}
              strokeWidth={2}
            />
          </div>
          <p className={`mt-2 text-[24px] font-black leading-none sm:text-[28px] ${stats === null ? "text-[var(--text-faint)]" : "text-[var(--text-heading)]"}`}>
            {stats === null ? "–" : value}
          </p>
          {extra}
          {detail && !extra && (
            <p className="mt-1.5 text-[11px] font-medium text-[var(--text-faint)]">{stats === null ? " " : detail}</p>
          )}
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
