"use client";

import React, { useEffect, useState } from "react";
import { HandRaisedIcon, ShoppingBagIcon, TrophyIcon } from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import { getPosts } from "../../shared/dummyPosts";

const CATEGORY_META = {
  Players: { label: "Players", icon: TrophyIcon, color: "bg-[var(--brand)]" },
  "Local Help": { label: "Local Help", icon: HandRaisedIcon, color: "bg-blue-500" },
  "For Sale": { label: "For Sale", icon: ShoppingBagIcon, color: "bg-purple-500" },
};

// v1 mock admin activity log — swap for a real audit trail later.
const mockAdminActivity = [
  { id: "adm-1", text: "Featured post \"Need 4 players for Sunday cricket\"", time: "10m ago" },
  { id: "adm-2", text: "Resolved report on \"Selling ergonomic study desk and chair\"", time: "2h ago" },
  { id: "adm-3", text: "Removed a duplicate travel-partner post", time: "1d ago" },
];

const AdminCategoryBreakdown = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => { setPosts(getPosts()); }, []);

  const counts = Object.keys(CATEGORY_META).map((category) => ({
    category,
    count: posts.filter((post) => post.category === category).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="p-4 sm:p-5" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Category breakdown</p>
        <h2 className="mt-0.5 text-[16px] font-black text-[var(--text-heading)]">Posts by category</h2>

        <div className="mt-4 space-y-3">
          {counts.map(({ category, count }) => {
            const meta = CATEGORY_META[category];
            const Icon = meta.icon;
            const pct = Math.round((count / max) * 100);

            return (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--text-heading)]">
                    <Icon className="h-3.5 w-3.5 text-[var(--brand)]" strokeWidth={2.25} />
                    {meta.label}
                  </span>
                  <span className="text-[var(--text-muted)]">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-input)]">
                  <div className={`h-full ${meta.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 sm:p-5" hover={false}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Admin log</p>
        <h2 className="mt-0.5 text-[16px] font-black text-[var(--text-heading)]">Recent admin activity</h2>

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
