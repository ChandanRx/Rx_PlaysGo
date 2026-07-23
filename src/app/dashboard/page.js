"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import PostModal from "../../components/PostModal";
import { ToastProvider } from "../../components/ui/Toast";
import { useAuthSession } from "../../hooks/useClientData";
import { signOut } from "../../shared/authSession";
import { getReports } from "../../shared/adminStore";
import AdminStats from "../../components/admin/AdminStats";
import AdminPostsTable from "../../components/admin/AdminPostsTable";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import AdminReportsTable from "../../components/admin/AdminReportsTable";
import AdminActivityTrends from "../../components/admin/AdminActivityTrends";
import { AdminVizStyles } from "../../components/admin/vizTheme";
import { DashSidebar, DashTopBar, TABS } from "../../components/admin/dash/DashShell";
import {
  CategoryBreakdownPanel, ContributorsPanel, PerformancePanel, RecentPostsPanel,
} from "../../components/admin/dash/OverviewPanels";

/* Rounded wrapper for the tabs that host the existing management tables. */
const TablePanel = ({ children }) => (
  <section className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)] md:p-6">
    {children}
  </section>
);

const AdminDashboardPage = () => {
  const router = useRouter();
  const { session } = useAuthSession();

  const [activeTab, setActiveTab] = useState("Overview");
  const [authorFilter, setAuthorFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setPendingReports(getReports().filter((r) => r.status === "Pending").length);
  }, [refreshKey]);

  const handleSelectUser = (email) => {
    setAuthorFilter(email);
    setActiveTab("Posts");
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <ToastProvider>
      <div
        className="admin-viz min-h-screen w-full"
        style={{
          background:
            "radial-gradient(1200px 500px at 12% -5%, var(--brand-soft), transparent 60%), radial-gradient(1000px 480px at 100% 0%, var(--info-soft), transparent 55%), var(--bg-page)",
        }}
      >
        <AdminVizStyles />

        <div className="mx-auto flex w-full max-w-7xl gap-4 p-3 sm:p-4 lg:gap-5 lg:p-7">
          <DashSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onBackToApp={() => router.push("/")}
            onSignOut={session ? handleSignOut : undefined}
          />

          <div className="min-w-0 flex-1 space-y-5">
            <DashTopBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              session={session}
              pendingReports={pendingReports}
            />

            <div className="flex flex-wrap items-end justify-between gap-2 px-1">
              <h1 className="text-[32px] font-black tracking-tight text-[var(--text-heading)] sm:text-[40px]">Dashboard</h1>
              <p className="pb-1.5 text-[13px] text-[var(--text-muted)]">Manage posts, users, and platform activity</p>
            </div>

            {activeTab === "Overview" && (
              <div className="space-y-5">
                <AdminStats key={refreshKey} />
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:auto-rows-min">
                  <div className="lg:col-span-4 lg:row-span-2">
                    <RecentPostsPanel onOpenPost={setSelectedPost} />
                  </div>
                  <div className="lg:col-span-8">
                    <PerformancePanel key={refreshKey} />
                  </div>
                  <div className="lg:col-span-4">
                    <CategoryBreakdownPanel key={refreshKey} />
                  </div>
                  <div className="lg:col-span-4">
                    <ContributorsPanel onSelectUser={handleSelectUser} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Activity" && (
              <TablePanel><AdminActivityTrends key={refreshKey} /></TablePanel>
            )}
            {activeTab === "Posts" && (
              <TablePanel>
                <AdminPostsTable
                  authorEmail={authorFilter}
                  onClearAuthorFilter={() => setAuthorFilter("")}
                  onOpenPost={setSelectedPost}
                  onDataChange={bumpRefresh}
                />
              </TablePanel>
            )}
            {activeTab === "Users" && (
              <TablePanel><AdminUsersTable onSelectUser={handleSelectUser} /></TablePanel>
            )}
            {activeTab === "Reports" && (
              <TablePanel><AdminReportsTable onDataChange={bumpRefresh} /></TablePanel>
            )}
          </div>
        </div>

        <AnimatePresence>
          {selectedPost && <PostModal key={selectedPost.id} post={selectedPost} onClose={() => setSelectedPost(null)} />}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
};

export default AdminDashboardPage;
