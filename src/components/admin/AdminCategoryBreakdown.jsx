"use client";

import React, { useEffect, useState } from "react";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import { getPosts } from "../../shared/dummyPosts";
import { getCategoryCounts, getStatusCounts, getSubcategoryCounts, getTopCities } from "./adminAnalytics";
import { categoryColor, CATEGORY_META, STATUS_COLORS } from "./vizTheme";
import AdminDonutChart from "./AdminDonutChart";
import AdminBarChart from "./AdminBarChart";
import { AdminEmpty, AdminLoading } from "./AdminTableState";

// v1 mock admin activity log — swap for a real audit trail later.
const mockAdminActivity = [
  { id: "adm-1", text: "Featured post \"Need 4 players for Sunday cricket\"", time: "10m ago" },
  { id: "adm-2", text: "Resolved report on \"Selling ergonomic study desk and chair\"", time: "2h ago" },
  { id: "adm-3", text: "Removed a duplicate travel-partner post", time: "1d ago" },
];

const SectionHeading = ({ kicker, title, subtitle }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">{kicker}</p>
    <h2 className="mt-0.5 text-[16px] font-black text-[var(--text-heading)]">{title}</h2>
    {subtitle && <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">{subtitle}</p>}
  </div>
);

/* Lifecycle split: one segmented bar (2px surface gaps between fills) plus a
 * legend that carries every label, count, and share — color never works alone. */
const StatusSplit = ({ data, total }) => (
  <div>
    <div
      className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full"
      role="img"
      aria-label={`Post status: ${data.map((d) => `${d.status} ${d.count}`).join(", ")}`}
    >
      {data.filter((d) => d.count > 0).map((d) => (
        <div
          key={d.status}
          style={{ width: `${(d.count / total) * 100}%`, background: STATUS_COLORS[d.status] }}
        />
      ))}
    </div>
    <ul className="mt-4 space-y-2.5">
      {data.map((d) => (
        <li key={d.status} className="flex items-center gap-2.5 text-[13px]">
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: STATUS_COLORS[d.status] }} />
          <span className="min-w-0 flex-1 truncate font-semibold text-[var(--text-body)]">{d.status}</span>
          <span className="font-bold tabular-nums text-[var(--text-heading)]">{d.count}</span>
          <span className="w-9 text-right text-[12px] tabular-nums text-[var(--text-muted)]">
            {total ? `${Math.round((d.count / total) * 100)}%` : "0%"}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const AdminCategoryBreakdown = () => {
  const [posts, setPosts] = useState(null);

  useEffect(() => { setPosts(getPosts()); }, []);

  if (posts === null) return <AdminLoading rows={5} />;

  if (posts.length === 0) {
    return (
      <AdminEmpty
        icon={ChartPieIcon}
        title="Nothing to chart yet"
        message="Once the community starts posting, category share and counts will show up here."
      />
    );
  }

  const donutData = getCategoryCounts(posts).map(({ category, count }) => ({
    label: CATEGORY_META[category]?.label || category,
    value: count,
    color: categoryColor(category),
  }));

  const barData = getSubcategoryCounts(posts).map((d) => ({
    label: d.label,
    value: d.count,
    color: categoryColor(d.category),
  }));

  const statusData = getStatusCounts(posts);

  // Single-series magnitude chart → the system's default single hue.
  const cityData = getTopCities(posts).map((d) => ({
    label: d.label,
    value: d.count,
    color: "var(--viz-players)",
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5" hover={false}>
          <SectionHeading kicker="Category share" title="Posts by category" />
          <div className="mt-5">
            <AdminDonutChart data={donutData} />
          </div>
        </Card>

        <Card className="p-4 sm:p-5" hover={false}>
          <SectionHeading
            kicker="Top subcategories"
            title="Posts by subcategory"
            subtitle="Colored by parent category"
          />
          <div className="mt-5">
            <AdminBarChart data={barData} ariaLabel="Posts by subcategory" />
          </div>
        </Card>

        <Card className="p-4 sm:p-5" hover={false}>
          <SectionHeading
            kicker="Lifecycle"
            title="Post status"
            subtitle="Where every post sits in its lifecycle"
          />
          <div className="mt-5">
            <StatusSplit data={statusData} total={posts.length} />
          </div>
        </Card>

        <Card className="p-4 sm:p-5" hover={false}>
          <SectionHeading
            kicker="Where"
            title="Top locations"
            subtitle="Cities with the most posts"
          />
          <div className="mt-5">
            <AdminBarChart data={cityData} ariaLabel="Posts by city" />
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5" hover={false}>
        <SectionHeading kicker="Admin log" title="Recent admin activity" />
        <ul className="mt-4 space-y-3">
          {mockAdminActivity.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 text-[13px]">
              <span className="text-[var(--text-body)]">{item.text}</span>
              <span className="shrink-0 text-[11px] text-[var(--text-faint)]">{item.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default AdminCategoryBreakdown;
