"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import PostModal from "../../components/PostModal";
import Card from "../../components/ui/Card";
import AdminStats from "../../components/admin/AdminStats";
import AdminPostsTable from "../../components/admin/AdminPostsTable";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import AdminReportsTable from "../../components/admin/AdminReportsTable";
import AdminCategoryBreakdown from "../../components/admin/AdminCategoryBreakdown";
import AdminActivityTrends from "../../components/admin/AdminActivityTrends";
import { AdminVizStyles } from "../../components/admin/vizTheme";

const TABS = ["Overview", "Activity", "Posts", "Users", "Reports"];

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [authorFilter, setAuthorFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  const handleSelectUser = (email) => {
    setAuthorFilter(email);
    setActiveTab("Posts");
  };

  return (
    <div className="admin-viz space-y-5">
      <AdminVizStyles />

      {/* header */}
      <Card className="p-5 md:p-6" hover={false}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--brand)]">Admin</p>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--text-heading)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--bg-card)]">
            <ShieldCheckIcon className="h-3 w-3" strokeWidth={2.5} />
            Admin
          </span>
        </div>
        <h1 className="mt-1 text-[22px] font-black text-[var(--text-heading)]">Admin Dashboard</h1>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">Manage posts, users, and platform activity</p>
      </Card>

      <AdminStats key={refreshKey} />

      {/* tabs + tab content */}
      <Card className="p-4 sm:p-5 md:p-6" hover={false}>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[var(--selected-bg)] text-[var(--selected-fg)]"
                  : "border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--text-heading)] hover:text-[var(--text-heading)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {activeTab === "Overview" && <AdminCategoryBreakdown key={refreshKey} />}
          {activeTab === "Activity" && <AdminActivityTrends key={refreshKey} />}
          {activeTab === "Posts" && (
            <AdminPostsTable
              authorEmail={authorFilter}
              onClearAuthorFilter={() => setAuthorFilter("")}
              onOpenPost={setSelectedPost}
              onDataChange={bumpRefresh}
            />
          )}
          {activeTab === "Users" && <AdminUsersTable onSelectUser={handleSelectUser} />}
          {activeTab === "Reports" && <AdminReportsTable onDataChange={bumpRefresh} />}
        </div>
      </Card>

      <AnimatePresence>
        {selectedPost && <PostModal key={selectedPost.id} post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboardPage;
