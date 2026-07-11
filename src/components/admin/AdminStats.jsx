"use client";

import React, { useEffect, useState } from "react";
import { CheckCircleIcon, ClipboardDocumentListIcon, FlagIcon, UsersIcon } from "@heroicons/react/24/outline";
import Card from "../ui/Card";
import { getAdminStats } from "../../shared/adminStore";

const AdminStats = () => {
  const [stats, setStats] = useState({ totalPosts: 0, activePosts: 0, uniqueUsers: 0, pendingReports: 0 });

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  const items = [
    { label: "Total posts", value: stats.totalPosts, icon: ClipboardDocumentListIcon },
    { label: "Active posts", value: stats.activePosts, icon: CheckCircleIcon },
    { label: "Unique users", value: stats.uniqueUsers, icon: UsersIcon },
    { label: "Pending reports", value: stats.pendingReports, icon: FlagIcon },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="p-3.5 sm:p-4" hover={false}>
          <div className="flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-[11px] sm:tracking-[0.15em]">
              {label}
            </p>
            <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--brand)] sm:h-5 sm:w-5" strokeWidth={2} />
          </div>
          <p className="mt-2 text-[24px] font-black leading-none text-[var(--text-heading)] sm:text-[28px]">
            {value}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
