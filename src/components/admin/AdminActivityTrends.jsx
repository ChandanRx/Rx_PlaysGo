"use client";

import React, { useEffect, useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import { getPosts } from "../../shared/dummyPosts";
import { getDatedPosts, getWeeklyActivity } from "./adminAnalytics";
import { categoryColor } from "./vizTheme";
import AdminTrendChart from "./AdminTrendChart";
import { AdminEmpty, AdminLoading } from "./AdminTableState";

/* "Activity" tab — posts per week over time. Weekly buckets are derived from
 * each post's `date` field (its scheduled/event date), a stand-in for a real
 * created-at timestamp — see the note in adminAnalytics.getWeeklyActivity. */

const SummaryTile = ({ label, value, detail }) => (
  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3.5">
    <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
    <p className="mt-1.5 text-[20px] font-black leading-none text-[var(--text-heading)]">{value}</p>
    {detail && <p className="mt-1 text-[11.5px] text-[var(--text-faint)]">{detail}</p>}
  </div>
);

const formatDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const AdminActivityTrends = () => {
  const [weeks, setWeeks] = useState(null);
  const [dated, setDated] = useState([]);

  useEffect(() => {
    const posts = getPosts();
    setWeeks(getWeeklyActivity(posts));
    setDated(getDatedPosts(posts));
  }, []);

  if (weeks === null) return <AdminLoading rows={5} />;

  if (weeks.length === 0) {
    return (
      <AdminEmpty
        icon={CalendarDaysIcon}
        title="No dated activity yet"
        message="Posts don't carry dates yet, so there's no timeline to plot. New posts with an event date will show up here."
      />
    );
  }

  const total = weeks.reduce((sum, w) => sum + w.count, 0);
  const busiest = weeks.reduce((best, w) => (w.count > best.count ? w : best), weeks[0]);
  const perWeek = (total / weeks.length).toFixed(1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = dated.filter((post) => post.dateObj >= today).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryTile label="Posts in window" value={total} detail={`across ${weeks.length} weeks`} />
        <SummaryTile label="Busiest week" value={busiest.count} detail={busiest.rangeLabel} />
        <SummaryTile label="Weekly average" value={perWeek} detail="posts per week" />
        <SummaryTile
          label="Upcoming"
          value={upcoming}
          detail={upcoming > 0 ? "events still ahead" : "no events ahead"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="p-4 sm:p-5 xl:col-span-2" hover={false}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Engagement trend</p>
          <h2 className="mt-0.5 text-[16px] font-black text-[var(--text-heading)]">Posts per week</h2>
          <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
            Based on each post&apos;s event date — a stand-in until posts carry a real creation timestamp.
          </p>
          <div className="mt-4">
            <AdminTrendChart weeks={weeks} />
          </div>
        </Card>

        <Card className="p-4 sm:p-5" hover={false}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Latest</p>
          <h2 className="mt-0.5 text-[16px] font-black text-[var(--text-heading)]">Recent by date</h2>
          <ul className="mt-4 space-y-3">
            {dated.slice(0, 6).map((post) => (
              <li key={post.id} className="flex items-start gap-2.5 text-[13px]">
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: categoryColor(post.category) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--text-heading)]">{post.title}</p>
                  <p className="mt-0.5 truncate text-[11.5px] text-[var(--text-muted)]">
                    {formatDate(post.dateObj)} · {post.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminActivityTrends;
