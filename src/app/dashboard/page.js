"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { AdjustmentsHorizontalIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import PostModal from "../../components/PostModal";
import { useAuthSession } from "../../hooks/useClientData";
import { signOut } from "../../shared/authSession";
import { getReports } from "../../shared/adminStore";
import AdminPostsTable from "../../components/admin/AdminPostsTable";
import AdminUsersTable from "../../components/admin/AdminUsersTable";
import AdminReportsTable from "../../components/admin/AdminReportsTable";
import AdminActivityTrends from "../../components/admin/AdminActivityTrends";
import { AdminVizStyles } from "../../components/admin/vizTheme";
import { DashSidebar, DashTopBar, TABS } from "../../components/admin/dash/DashShell";
import {
  ActivitiesPanel, DealsTablePanel, DonutPanel, KpiCards, LocationsPanel, RevenuePanel,
} from "../../components/admin/dash/OverviewPanels";
import { staggerContainer } from "../../shared/motionPresets";

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
    <>
      <div className="admin-viz min-h-screen w-full bg-[var(--bg-card)]">
        <AdminVizStyles />

        <DashTopBar session={session} />

        <div className="flex min-h-[calc(100vh-65px)]">
          <DashSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onBackToApp={() => router.push("/")}
            onSignOut={session ? handleSignOut : undefined}
            pendingReports={pendingReports}
          />

          <main className="min-w-0 flex-1 bg-[var(--bg-page)] p-4 sm:p-5 lg:p-7">
                {/* mobile tab strip */}
                <div className="-mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden">
                  {TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`shrink-0 rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition ${
                        activeTab === tab
                          ? "bg-[var(--accent-soft)] text-[var(--text-heading)]"
                          : "border border-[var(--border-subtle)] text-[var(--text-muted)]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* section header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="text-[22px] font-black tracking-tight text-[var(--text-heading)]">
                    {activeTab === "Overview" ? "Overview" : activeTab}
                  </h1>
                  {activeTab === "Overview" && (
                    <div className="flex items-center gap-2">
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]">
                        <AdjustmentsHorizontalIcon className="h-4 w-4" strokeWidth={2} /> Filter
                      </button>
                      <button type="button" onClick={() => setActiveTab("Posts")} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--text-heading)]">
                        <ArrowUpTrayIcon className="h-4 w-4" strokeWidth={2} /> Export
                      </button>
                    </div>
                  )}
                </div>

                {activeTab === "Overview" && (
                  <m.div className="mt-5 space-y-4" variants={staggerContainer} initial="hidden" animate="show">
                    <KpiCards onSelectTab={setActiveTab} />
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                      <div className="lg:col-span-8"><RevenuePanel key={refreshKey} /></div>
                      <div className="lg:col-span-4"><LocationsPanel key={refreshKey} /></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                      <div className="lg:col-span-3"><DonutPanel key={refreshKey} /></div>
                      <div className="md:col-span-1 lg:col-span-4"><ActivitiesPanel onOpenPost={setSelectedPost} /></div>
                      <div className="lg:col-span-5"><DealsTablePanel onOpenPost={setSelectedPost} onSelectTab={setActiveTab} /></div>
                    </div>
                  </m.div>
                )}

                {activeTab === "Activity" && <div className="mt-5"><AdminActivityTrends key={refreshKey} /></div>}
                {activeTab === "Posts" && (
                  <div className="mt-5">
                    <AdminPostsTable
                      authorEmail={authorFilter}
                      onClearAuthorFilter={() => setAuthorFilter("")}
                      onOpenPost={setSelectedPost}
                      onDataChange={bumpRefresh}
                    />
                  </div>
                )}
                {activeTab === "Users" && <div className="mt-5"><AdminUsersTable onSelectUser={handleSelectUser} /></div>}
                {activeTab === "Reports" && <div className="mt-5"><AdminReportsTable onDataChange={bumpRefresh} /></div>}
              </main>
            </div>

        <AnimatePresence>
          {selectedPost && <PostModal key={selectedPost.id} post={selectedPost} onClose={() => setSelectedPost(null)} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AdminDashboardPage;
